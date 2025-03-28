from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model
from django.shortcuts import get_object_or_404
from .models import StaffProfile, GuestProfile
from .serializers import (
    UserSerializer, 
    StaffProfileSerializer, 
    GuestProfileSerializer,
    RegisterSerializer,
    ChangePasswordSerializer,
    GuestProfileUpdateSerializer
)
from .permissions import IsAdminOrManager, IsSelfOrAdmin

User = get_user_model()

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAdminOrManager]
    
    def get_permissions(self):
        if self.action in ['retrieve', 'update', 'partial_update']:
            self.permission_classes = [IsSelfOrAdmin]
        return super().get_permissions()
    
    @action(detail=False, methods=['post'], permission_classes=[permissions.AllowAny])
    def register(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            refresh = RefreshToken.for_user(user)
            return Response({
                'user': UserSerializer(user).data,
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['post'], permission_classes=[IsSelfOrAdmin])
    def change_password(self, request, pk=None):
        user = self.get_object()
        serializer = ChangePasswordSerializer(data=request.data)
        
        if serializer.is_valid():
            if not user.check_password(serializer.validated_data['old_password']):
                return Response({"old_password": ["Wrong password."]}, status=status.HTTP_400_BAD_REQUEST)
            
            user.set_password(serializer.validated_data['new_password'])
            user.save()
            return Response({"status": "password changed"}, status=status.HTTP_200_OK)
            
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['get'], permission_classes=[permissions.IsAuthenticated])
    def me(self, request):
        user = request.user
        serializer = UserSerializer(user)
        return Response(serializer.data)

class StaffProfileViewSet(viewsets.ModelViewSet):
    queryset = StaffProfile.objects.all()
    serializer_class = StaffProfileSerializer
    permission_classes = [IsAdminOrManager]
    
    def get_permissions(self):
        if self.action in ['retrieve']:
            self.permission_classes = [IsSelfOrAdmin]
        return super().get_permissions()
    
    @action(detail=False, methods=['get'], permission_classes=[permissions.IsAuthenticated])
    def my_profile(self, request):
        user = request.user
        if not user.is_staff_member:
            return Response({"detail": "Not a staff member"}, status=status.HTTP_403_FORBIDDEN)
        
        profile = get_object_or_404(StaffProfile, user=user)
        serializer = self.get_serializer(profile)
        return Response(serializer.data)

class GuestProfileViewSet(viewsets.ModelViewSet):
    queryset = GuestProfile.objects.all()
    serializer_class = GuestProfileSerializer
    permission_classes = [IsAdminOrManager]
    
    def get_permissions(self):
        if self.action in ['retrieve', 'update', 'partial_update', 'my_profile']:
            self.permission_classes = [IsSelfOrAdmin]
        return super().get_permissions()
    
    def get_serializer_class(self):
        if self.action in ['update', 'partial_update']:
            return GuestProfileUpdateSerializer
        return super().get_serializer_class()
    
    @action(detail=False, methods=['get', 'put', 'patch'], permission_classes=[permissions.IsAuthenticated])
    def my_profile(self, request):
        user = request.user
        if not user.is_guest:
            return Response({"detail": "Not a guest"}, status=status.HTTP_403_FORBIDDEN)
        
        profile = get_object_or_404(GuestProfile, user=user)
        
        if request.method == 'GET':
            serializer = self.get_serializer(profile)
            return Response(serializer.data)
        
        serializer = GuestProfileUpdateSerializer(profile, data=request.data, partial=request.method == 'PATCH')
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class CustomTokenObtainPairView(TokenObtainPairView):
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        
        if response.status_code == 200:
            user = User.objects.get(email=request.data['email'])
            user_data = UserSerializer(user).data
            response.data['user'] = user_data
            
        return response