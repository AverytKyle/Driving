from django.urls import path, include
from ..views.address_views import *
from ..views.routeaddress_views import *

urlpatterns = [
    path('', get_addresses, name='get_addresses'),
    path('route/<int:route_id>/', get_addresses_by_route, name='get_addresses_by_route'),
    path('route/<int:route_id>/reorder/', reorder_route_addresses, name='reorder_route_addresses'),
    path('<int:address_id>/', get_address, name='get_address'),
    path('create/', create_address, name='create_address'),
    path('update/<int:address_id>/', update_address, name='update_address'),
    path('delete/<int:address_id>/', delete_address, name='delete_address'),
]