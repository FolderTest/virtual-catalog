from django.urls import path
from .views import PredictVehicleType, add_to_catalog, GetVehicles, delete_vehicle, update_vehicle
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('predict/', PredictVehicleType.as_view(), name='predict_vehicle_type'),
    path('add_to_catalog/', add_to_catalog, name='add_to_catalog'),
    path('get_vehicles/', GetVehicles.as_view(), name='get_vehicles'),  # Nowa ścieżka
    path('delete_vehicle/<int:vehicle_id>/', delete_vehicle, name='delete_vehicle'),
    path('update_vehicle/<int:vehicle_id>/', update_vehicle, name='update_vehicle'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
