from django.core.management.base import BaseCommand
from backend.models import User, Route, Address, RouteAddress
from django.utils import timezone
import random
from faker import Faker
import uuid


class Command(BaseCommand):
    help = 'Seed the database with realistic fake Users, Routes, Addresses and RouteAddresses using Faker'

    def add_arguments(self, parser):
        parser.add_argument('--clear', action='store_true', help='Clear existing seeded data before seeding')
        parser.add_argument('--users', type=int, default=3, help='Number of users to create')
        parser.add_argument('--routes-per-user', type=int, default=2, help='Number of routes per user')
        parser.add_argument('--addresses-per-route', type=int, default=5, help='Number of addresses per route')

    def handle(self, *args, **options):
        faker = Faker()
        Faker.seed(0)

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
            # ensure uniqueness by appending index if necessary
            username = faker.user_name()
            email = faker.unique.email()
            u = User.objects.create(
                username=f"{username}_{i}",
                email=email,
                password='password123'
            )
            users.append(u)

        # create a pool of addresses (bigger than what each route needs so routes can share addresses)
        pool_size = max(10, users_count * routes_per_user * addresses_per_route // 2)
        address_pool = []
        self.stdout.write(f'Generating {pool_size} addresses')
        for _ in range(pool_size):
            lat = float(faker.latitude())
            lng = float(faker.longitude())
            addr = Address.objects.create(
                label=faker.word().title(),
                address_input=faker.street_address(),
                formatted_address=f"{faker.street_address()}, {faker.city()}, {faker.country()}",
                latitude=lat,
                longitude=lng,
                place_id=str(uuid.uuid4()),
            )
            address_pool.append(addr)

        self.stdout.write('Creating routes and attaching addresses...')

        total_routes = 0
        total_route_addresses = 0
        for user in users:
            for r in range(routes_per_user):
                total_routes += 1
                route = Route.objects.create(
                    user_id=user,
                    name=f'{user.username}_route_{r+1}',
                    optimized=random.choice([True, False]),
                )

                chosen = random.sample(address_pool, min(addresses_per_route, len(address_pool)))
                for idx, addr in enumerate(chosen, start=1):
                    visited = random.choice([True, False])
                    visited_at = timezone.now() if visited and random.choice([True, False]) else None
                    RouteAddress.objects.create(
                        route_id=route,
                        address_id=addr,
                        stop_order=idx,
                        note=faker.sentence(nb_words=8),
                        visited=visited,
                        visited_at=visited_at,
                    )
                    total_route_addresses += 1

        self.stdout.write(self.style.SUCCESS(f'Seeding complete. Created {len(users)} users, {total_routes} routes, and {total_route_addresses} route addresses.'))
