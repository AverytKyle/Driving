from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from ..models import User


def sanitize_user(user: User):
	"""Return a dict representation of user without the password field."""
	if not user:
		return None
	return {
		'id': user.id,
		'username': user.username,
		'email': user.email,
		'created_at': user.created_at,
	}

@api_view(['GET', 'POST', 'DELETE'])
def session_view(request):
	"""Session endpoint:
	GET -> restore session (returns user if logged in)
	POST -> login with { username, password }
	DELETE -> logout (clear session)
	"""

	# Restore session / check logged-in
	if request.method == 'GET':
		user_id = request.session.get('user_id')
		if not user_id:
			return Response({'user': None}, status=status.HTTP_200_OK)
		try:
			user = User.objects.get(id=user_id)
			return Response({'user': sanitize_user(user)}, status=status.HTTP_200_OK)
		except User.DoesNotExist:
			# invalid session, clear it
			request.session.pop('user_id', None)
			return Response({'user': None}, status=status.HTTP_200_OK)

	# Login
	if request.method == 'POST':
		username = request.data.get('username')
		password = request.data.get('password')
		if not username or not password:
			return Response({'error': 'username and password required'}, status=status.HTTP_400_BAD_REQUEST)
		try:
			user = User.objects.get(username=username)
			# NOTE: passwords are stored in plain text in this project model.
			# For production, switch to Django's auth and hashed passwords.
			if user.password != password:
				return Response({'error': 'invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
			# save user id in session
			request.session['user_id'] = user.id
			return Response({'user': sanitize_user(user)}, status=status.HTTP_200_OK)
		except User.DoesNotExist:
			return Response({'error': 'invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

	# Logout
	if request.method == 'DELETE':
		request.session.pop('user_id', None)
		return Response(status=status.HTTP_204_NO_CONTENT)




