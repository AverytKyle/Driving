from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from ..models import Address, Route, RouteAddress
from ..serializer import AddressSerializer

@api_view(['GET'])
def get_addresses_by_route(request, route_id):
    """Return all addresses belonging to a route, ordered by stop_order and include routeaddress metadata."""
    if request.method == 'GET':
        # verify route exists
        try:
            route = Route.objects.get(id=route_id)
        except Route.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        # Query RouteAddress entries and prefetch related Address for ordering
        route_addresses = RouteAddress.objects.filter(route_id=route).select_related('address_id').order_by('stop_order')

        # Build combined payload: include address fields + stop_order, note, visited, visited_at
        results = []
        for ra in route_addresses:
            addr = ra.address_id
            addr_data = AddressSerializer(addr).data
            addr_data.update({
                'stop_order': ra.stop_order,
                'note': ra.note,
                'visited': ra.visited,
                'visited_at': ra.visited_at,
                'route_address_id': ra.id,
            })
            results.append(addr_data)

        return Response(results)
