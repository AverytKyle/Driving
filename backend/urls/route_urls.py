from django.urls import path, include
from ..views.route_views import *
from ..views.routeaddress_views import get_addresses_by_route

urlpatterns = [
    path('user/<int:user_id>/routes/', get_user_routes, name='get_user_routes'),
    path('<int:route_id>/', get_route, name='get_route'),
    path('<int:route_id>/addresses/', get_addresses_by_route, name='get_addresses_by_route'),
    path('create/', create_route, name='create_route'),
    path('update/<int:route_id>/', update_route, name='update_route'),
    path('delete/<int:route_id>/', delete_route, name='delete_route'),
]