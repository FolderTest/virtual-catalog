from rest_framework import serializers
from .models import Vehicle, VehicleImage

class VehicleImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = VehicleImage
        fields = ['image']

class VehicleSerializer(serializers.ModelSerializer):
    vehicleImage = VehicleImageSerializer()  # Tutaj dodajemy pole obrazu
    productionYear = serializers.IntegerField(required=False, allow_null=True)
    class Meta:
        model = Vehicle
        fields = ['id', 'vehicleType', 'brand', 'model', 'bodyType', 'productionYear', 'vehicleImage', 'description']  # Dodajemy 'description' do pól

    
    def update(self, instance, validated_data):
        vehicle_image_data = validated_data.pop('vehicleImage', None)
        vehicle_image_serializer = VehicleImageSerializer(instance.vehicleImage, data=vehicle_image_data, partial=True)
        if vehicle_image_serializer.is_valid():
            vehicle_image_serializer.save()

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        
        return instance
