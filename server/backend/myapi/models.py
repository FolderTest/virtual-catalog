from django.db import models
from django.contrib.auth import get_user_model

class VehicleImage(models.Model):
    user = models.ForeignKey(get_user_model(), on_delete=models.CASCADE)
    image = models.ImageField(upload_to='vehicle_images/')
    prediction = models.CharField(max_length=255, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

class Vehicle(models.Model):
    user = models.ForeignKey(get_user_model(), on_delete=models.CASCADE)
    vehicleImage = models.OneToOneField(VehicleImage, on_delete=models.CASCADE, null=True, blank=True)  # Link to VehicleImage
    vehicleType = models.CharField(max_length=100, null=True, blank=True)  # Allow null and blank
    brand = models.CharField(max_length=100, null=True, blank=True)  # Allow null and blank
    model = models.CharField(max_length=100, null=True, blank=True)  # Allow null and blank
    bodyType = models.CharField(max_length=100, null=True, blank=True)  # New field for Body Type
    productionYear = models.IntegerField(null=True, blank=True)
    description = models.CharField(max_length=255, null=True, blank=True)  # Nowe pole dla opisu
