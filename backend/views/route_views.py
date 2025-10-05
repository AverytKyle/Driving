from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from ..models import Route
from ..serializer import RouteSerializer

@api_view(['GET'])
def get_user_routes(request, user_id):
    if request.method == 'GET':
        routes = Route.objects.filter(user_id=user_id)
        serializer = RouteSerializer(routes, many=True)
        return Response(serializer.data)
    
@api_view(['GET'])
def get_route(request, route_id):
    if request.method == 'GET':
        try:
            route = Route.objects.get(id=route_id)
            serializer = RouteSerializer(route)
            return Response(serializer.data)
        except Route.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        
@api_view(['POST'])
def create_route(request):
    if request.method == 'POST':
        serializer = RouteSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['PUT', 'PATCH'])
def update_route(request, route_id):
    try:
        route = Route.objects.get(id=route_id)
    except Route.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    if request.method == 'PATCH':
        partial = True
        serializer = RouteSerializer(route, data=request.data, partial=partial)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    if request.method == 'PUT':
        serializer = RouteSerializer(route, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['DELETE'])
def delete_route(request, route_id):
    try:
        route = Route.objects.get(id=route_id)
    except Route.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    if request.method == 'DELETE':
        route.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)