from django.core.management.base import BaseCommand
from backend.models import User, Route, Address, RouteAddress
from django.utils import timezone
import random


class Command(BaseCommand):
    help = 'Seed the database with sample Users, Routes, Addresses and RouteAddresses'

    def add_arguments(self, parser):
        parser.add_argument('--clear', action='store_true', help='Clear existing seeded data before seeding')
        parser.add_argument('--users', type=int, default=3, help='Number of users to create')
        parser.add_argument('--routes-per-user', type=int, default=2, help='Number of routes per user')
        parser.add_argument('--addresses-per-route', type=int, default=5, help='Number of addresses per route')

    def handle(self, *args, **options):
        if options['clear']:
            self.stdout.write('Clearing existing data...')
            RouteAddress.objects.all().delete()
            Route.objects.all().delete()
            Address.objects.all().delete()
            User.objects.all().delete()

        users_count = options['users']
        routes_per_user = options['routes_per_user']
        addresses_per_route = options['addresses_per_route']

        self.stdout.write(f'Creating {users_count} users')

        users = []
        for i in range(users_count):
            u = User.objects.create(
                username=f'user{i+1}',
                email=f'user{i+1}@example.com'
            )
            users.append(u)

        sample_addresses = [
            {
                'label': 'Home',
                'address_input': '123 Main St',
                'formatted_address': '123 Main St, Springfield, USA',
                'latitude': 39.7817,
                'longitude': -89.6501,
                'place_id': 'place_home_1',
            },
            {
                'label': 'Work',
                'address_input': '456 Office Rd',
                'formatted_address': '456 Office Rd, Springfield, USA',
                'latitude': 39.7910,
                'longitude': -89.6436,
                'place_id': 'place_work_1',
            },
            {
                'label': 'Shop',
                'address_input': '789 Market Ave',
                'formatted_address': '789 Market Ave, Springfield, USA',
                'latitude': 39.7990,
                'longitude': -89.6400,
                'place_id': 'place_shop_1',
            },
            {
                'label': 'Park',
                'address_input': '101 Park Ln',
                'formatted_address': '101 Park Ln, Springfield, USA',
                'latitude': 39.7800,
                'longitude': -89.6600,
                'place_id': 'place_park_1',
            },
            {
                'label': 'Client',
                'address_input': '202 Client Blvd',
                'formatted_address': '202 Client Blvd, Springfield, USA',
                'latitude': 39.7700,
                'longitude': -89.6700,
                'place_id': 'place_client_1',
            },
        ]

        # create a pool of addresses to reuse
        address_pool = []
        for ad in sample_addresses:
            addr = Address.objects.create(
                label=ad['label'],
                address_input=ad['address_input'],
                formatted_address=ad['formatted_address'],
                latitude=ad['latitude'],
                longitude=ad['longitude'],
                place_id=ad['place_id'],
            )
            address_pool.append(addr)

        self.stdout.write('Creating routes and attaching addresses...')

        for user in users:
            for r in range(routes_per_user):
                route = Route.objects.create(
                    user_id=user,
                    name=f'{user.username}_route_{r+1}',
                    optimized=random.choice([True, False]),
                )

                chosen = random.sample(address_pool, min(addresses_per_route, len(address_pool)))
                for idx, addr in enumerate(chosen, start=1):
                    RouteAddress.objects.create(
                        route_id=route,
                        address_id=addr,
                        stop_order=idx,
                        note=f'Stop {idx} for {route.name}',
                        visited=random.choice([True, False]),
                        visited_at=timezone.now() if random.choice([True, False]) else None,
                    )

        self.stdout.write(self.style.SUCCESS('Seeding complete.'))
