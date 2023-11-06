from django.contrib.auth import get_user_model, authenticate
from rest_framework import generics, status
from rest_framework.response import Response
from .serializers import RegisterSerializer, LoginSerializer
from rest_framework.authtoken.models import Token

class RegisterView(generics.CreateAPIView):
    queryset = get_user_model().objects.all()
    serializer_class = RegisterSerializer

    def create(self, request, *args, **kwargs):
        # To zweryfikuje dane, zahashuje hasło i utworzy użytkownika
        response = super().create(request, *args, **kwargs)
        
        # Po utworzeniu użytkownika, po prostu pobieramy użytkownika i tworzymy dla niego token
        user = get_user_model().objects.get(username=request.data['username'])
        token, created = Token.objects.get_or_create(user=user)
        
        return Response({'token': token.key})


class LoginView(generics.CreateAPIView):
    serializer_class = LoginSerializer

    def create(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        user = authenticate(username=username, password=password)
        if user:
            token, created = Token.objects.get_or_create(user=user)
            return Response({'token': token.key})
        else:
            return Response({'error': 'Invalid credentials'}, status=status.HTTP_400_BAD_REQUEST)