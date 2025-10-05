from django.db import models

class User(models.Model):
    id = models.AutoField(primary_key=True)
    username = models.CharField(max_length=150, unique=True)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=128)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return {
            "id": self.id,
            "username": self.username,
            "email": self.email,
        }
    
class Route(models.Model):
    id = models.AutoField(primary_key=True)
    user_id = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    optimized = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return {
            "id": self.id,
            "user_id": self.user_id.id,
            "name": self.name,
            "optimized": self.optimized,
        }
    
class Address(models.Model):
    id = models.AutoField(primary_key=True)
    label = models.CharField(max_length=100)
    address_input = models.CharField(max_length=255)
    formatted_address = models.CharField(max_length=255)
    latitude = models.FloatField()
    longitude = models.FloatField()
    place_id = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return {
            "id": self.id,
            "label": self.label,
            "address_input": self.address_input,
            "formatted_address": self.formatted_address,
            "latitude": self.latitude,
            "longitude": self.longitude,
            "place_id": self.place_id,
        }
    
class RouteAddress(models.Model):
    id = models.AutoField(primary_key=True)
    route_id = models.ForeignKey(Route, on_delete=models.CASCADE)
    address_id = models.ForeignKey(Address, on_delete=models.CASCADE)
    stop_order = models.IntegerField()
    note = models.TextField(blank=True, null=True)
    visited = models.BooleanField(default=False)
    visited_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return {
            "id": self.id,
            "route_id": self.route_id.id,
            "address_id": self.address_id.id,
            "stop_order": self.stop_order,
            "note": self.note,
            "visited": self.visited,
            "visited_at": self.visited_at,
        }