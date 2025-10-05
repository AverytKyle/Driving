from django.urls import path, include
from ..views.address_views import *

urlpatterns = [
    path('', get_addresses, name='get_addresses'),
    path('<int:address_id>/', get_address, name='get_address'),
    path('create/', create_address, name='create_address'),
    path('update/<int:address_id>/', update_address, name='update_address'),
    path('delete/<int:address_id>/', delete_address, name='delete_address'),
]