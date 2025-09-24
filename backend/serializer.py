from rest_framework import serializers
from .models import User, Route, Address, RouteAddress

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'

class RouteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Route
        fields = '__all__'

class AddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = Address
        fields = '__all__'

class RouteAddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = RouteAddress
        fields = '__all__'
