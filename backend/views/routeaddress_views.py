from django.db import transaction
from rest_framework import status
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

@api_view(['POST'])
def reorder_route_addresses(request, route_id):
    """
    Accepts JSON body: { "ordered_route_address_ids": [ra_id1, ra_id2, ...] }
    Updates the RouteAddress.stop_order values 1..N according to the array order
    and returns the same payload shape as get_addresses_by_route (addresses with
    route_address_id and stop_order).
    """
    # basic validation and route existence
    try:
        route = Route.objects.get(id=route_id)
    except Route.DoesNotExist:
        return Response({"detail": "Route not found."}, status=status.HTTP_404_NOT_FOUND)

    ordered = request.data.get("ordered_route_address_ids")
    if not isinstance(ordered, list):
        return Response({"detail": "ordered_route_address_ids must be a list"}, status=status.HTTP_400_BAD_REQUEST)

    # apply reordering in a transaction
    try:
        with transaction.atomic():
            for index, ra_id in enumerate(ordered, start=1):
                try:
                    ra = RouteAddress.objects.get(id=ra_id, route_id=route)
                    ra.stop_order = index
                    ra.save()
                except RouteAddress.DoesNotExist:
                    # If an id is invalid for this route, abort
                    return Response(
                        {"detail": f"RouteAddress {ra_id} not found for route {route_id}"},
                        status=status.HTTP_400_BAD_REQUEST
                    )

        # After saving, build the same response shape as get_addresses_by_route
        route_addresses = RouteAddress.objects.filter(route_id=route).select_related('address_id').order_by('stop_order')
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

        return Response(results, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({"detail": "Server error when reordering", "error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)