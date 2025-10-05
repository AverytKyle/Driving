from django.urls import path
from ..views.auth_views import session_view

urlpatterns = [
    path('', session_view, name='session'),
]
