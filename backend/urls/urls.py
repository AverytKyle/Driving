from django.urls import path, include
from ..views.user_views import *

urlpatterns = [
    path('users/', include('backend.urls.user_urls')),
    path('routes/', include('backend.urls.route_urls')),
    path('addresses/', include('backend.urls.address_urls')),
]