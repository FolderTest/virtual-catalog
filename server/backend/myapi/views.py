from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from keras.models import Sequential
from keras.layers import Dense, Dropout, BatchNormalization
from keras import regularizers
from keras.preprocessing import image
from keras.applications.efficientnet import preprocess_input
import tensorflow as tf
import numpy as np
import traceback
from io import BytesIO
from .models import VehicleImage, Vehicle
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from .serializers import VehicleSerializer  # Upewnij się, że masz Serializer dla Twojego modelu Vehicle


# Model setup (run once when the application starts)
base_model = tf.keras.applications.EfficientNetB7(
    include_top=False, weights="imagenet", input_shape=(224, 224, 3), pooling='max'
)
base_model.trainable = False

model = Sequential([
    base_model,
    BatchNormalization(axis=-1, momentum=0.99, epsilon=0.001),
    Dense(128, kernel_regularizer=regularizers.l2(l=0.016), 
          activity_regularizer=regularizers.l1(0.006),
          bias_regularizer=regularizers.l1(0.006), activation='relu'),
    Dropout(rate=0.45, seed=123),
    Dense(4, activation='softmax')  # Assuming 4 classes
])

# Provide the correct path to your model weights
model.load_weights('myapi/ml_model/my_model_weights.h5')

# Load the car body type model
car_body_type_model = tf.keras.models.load_model('myapi/ml_model/cartype_model.h5')
car_body_type_labels = ['Cab', 'Convertible', 'Coupe', 'Hatchback', 'Minivan', 'Other', 'SUV', 'Sedan', 'Van', 'Wagon']

def predict_car_body_type(img_array):
    prediction = car_body_type_model.predict(img_array)
    predicted_class_index = np.argmax(prediction)
    predicted_class_label = car_body_type_labels[predicted_class_index]
    prediction_accuracy = round(np.max(prediction) * 100, 2)
    return predicted_class_label, prediction_accuracy


class PredictVehicleType(APIView):
    def post(self, request, *args, **kwargs):
        try:
            file = request.FILES['file']  # Get the file from request
            file_content = file.read()  # Save file content to a variable

            # Image pre-processing for vehicle type prediction
            img = image.load_img(BytesIO(file_content), target_size=(224, 224))
            img_array = image.img_to_array(img)
            img_array = np.expand_dims(img_array, axis=0)
            img_array = preprocess_input(img_array)

            # Prediction for vehicle type
            prediction = model.predict(img_array)
            predicted_class_index = np.argmax(prediction)
            class_labels = ['Bus', 'Car', 'Truck', 'Motorcycle']
            predicted_class_label = class_labels[predicted_class_index]

            response_data = {
                "prediction": predicted_class_label,
                "probabilities": {
                    "Bus": prediction[0][0],
                    "Car": prediction[0][1],
                    "Truck": prediction[0][2],
                    "Motorcycle": prediction[0][3]
                }
            }

            # If the predicted vehicle type is 'Car', predict the car body type
            if predicted_class_label == 'Car':
                # Image pre-processing for car body type prediction
                img = image.load_img(BytesIO(file_content), target_size=(256, 256))
                img_array = image.img_to_array(img)
                img_array = np.expand_dims(img_array, axis=0)
                img_array = preprocess_input(img_array)

                car_body_type, car_body_accuracy = predict_car_body_type(img_array)
                response_data.update({
                    "car_body_type": car_body_type,
                    "car_body_accuracy": car_body_accuracy
                })

            vehicle_image = VehicleImage(user=request.user, image=file, prediction=predicted_class_label)
            vehicle_image.save()

            return Response(response_data, status=status.HTTP_200_OK)

        except Exception as e:
            # Handle exceptions and return the error message
            print("Error: ", str(e))
            print("Traceback: ", traceback.format_exc())
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_to_catalog(request):
    user = request.user
    vehicle_data = request.data

    # Save the VehicleImage first
    vehicle_image = VehicleImage(
        user=user,
        image=vehicle_data.get('vehicleImage', None),  # Assume you send image as 'vehicleImage'
        prediction=vehicle_data.get('prediction', '')
    )
    vehicle_image.save()

    # Handle the productionYear field properly
    production_year_value = vehicle_data.get('productionYear', None)
    try:
        # Attempt to convert the productionYear value to an integer
        production_year = int(production_year_value)
    except (ValueError, TypeError):
        # If conversion fails, check if the value is 'null' or None
        if production_year_value in ('null', None):
            production_year = None  # Set production_year to None if it's 'null' or None
        else:
            return Response({'error': 'Invalid value for productionYear'}, status=status.HTTP_400_BAD_REQUEST)

    # Now save the Vehicle
    vehicle = Vehicle(
        user=user,
        vehicleImage=vehicle_image,
        vehicleType=vehicle_data.get('vehicleType', None),
        brand=vehicle_data.get('brand', None),
        model=vehicle_data.get('model', None),
        bodyType=vehicle_data.get('bodyType', None),
        productionYear=production_year,  # Use the sanitized production_year value
        description=vehicle_data.get('description', None)  # Nowe pole description
    )
    vehicle.save()

    return Response({"message": "Vehicle added to catalog successfully!"})


class GetVehicles(APIView):

    permission_classes = [IsAuthenticated]  # Dodaj to, aby upewnić się, że widok jest chroniony

    def get(self, request, format=None):
        user = request.user  # Pobierz zalogowanego użytkownika
        vehicles = Vehicle.objects.filter(user=user)  # Filtruj pojazdy na podstawie zalogowanego użytkownika
        serializer = VehicleSerializer(vehicles, many=True)
        print(Response)
        return Response(serializer.data, status=status.HTTP_200_OK)

    
    

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_vehicle(request, vehicle_id):
    try:
        vehicle = Vehicle.objects.get(id=vehicle_id)
        if request.user == vehicle.user:
            vehicle.delete()
            return Response({"message": "Vehicle deleted successfully!"}, status=status.HTTP_200_OK)
        else:
            return Response({"error": "You do not have permission to delete this vehicle."}, status=status.HTTP_403_FORBIDDEN)
    except Vehicle.DoesNotExist:
        return Response({"error": "Vehicle not found."}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    

@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def update_vehicle(request, vehicle_id):
    try:
        print(request.data)
        vehicle = Vehicle.objects.get(id=vehicle_id)
        if request.user == vehicle.user:
            serializer = VehicleSerializer(vehicle, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({"error": "You do not have permission to edit this vehicle."}, status=status.HTTP_403_FORBIDDEN)
    except Vehicle.DoesNotExist:
        return Response({"error": "Vehicle not found."}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
