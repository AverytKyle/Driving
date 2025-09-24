from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import User, Route, Address, RouteAddress
from .serializer import UserSerializer, RouteSerializer, AddressSerializer, RouteAddressSerializer

