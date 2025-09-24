from django.urls import path, include
from ..views.user_views import *

urlpatterns = [
    path('users/', include('backend.urls.user_urls')),
    
]