from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import StaffProfile, GuestProfile

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'first_name', 'last_name', 'role', 'phone', 'address', 'profile_picture']
        read_only_fields = ['id']

class StaffProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = StaffProfile
        fields = ['id', 'user', 'employee_id', 'department', 'position', 'hire_date']
        read_only_fields = ['id']

class GuestProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = GuestProfile
        fields = ['id', 'user', 'nationality', 'passport_number', 'id_number', 'date_of_birth', 'preferences']
        read_only_fields = ['id']

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})
    password_confirm = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})
    
    class Meta:
        model = User
        fields = ['email', 'first_name', 'last_name', 'password', 'password_confirm', 'role', 'phone', 'address']
    
    def validate(self, data):
        if data['password'] != data['password_confirm']:
            raise serializers.ValidationError({"password_confirm": "Passwords don't match"})
        return data
    
    def create(self, validated_data):
        validated_data.pop('password_confirm')
        user = User.objects.create_user(**validated_data)
        
        if user.role == User.Roles.GUEST:
            GuestProfile.objects.create(user=user)
        elif user.is_staff_member:
            StaffProfile.objects.create(
                user=user,
                employee_id=f"EMP{user.id:06d}",
                department=validated_data.get('role', '').capitalize(),
                position=validated_data.get('role', '').capitalize(),
                hire_date=user.date_joined.date()
            )
        
        return user

class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True, style={'input_type': 'password'})
    new_password = serializers.CharField(required=True, style={'input_type': 'password'})
    new_password_confirm = serializers.CharField(required=True, style={'input_type': 'password'})
    
    def validate(self, data):
        if data['new_password'] != data['new_password_confirm']:
            raise serializers.ValidationError({"new_password_confirm": "Passwords don't match"})
        return data

class GuestProfileUpdateSerializer(serializers.ModelSerializer):
    first_name = serializers.CharField(source='user.first_name', required=False)
    last_name = serializers.CharField(source='user.last_name', required=False)
    email = serializers.EmailField(source='user.email', required=False)
    phone = serializers.CharField(source='user.phone', required=False)
    address = serializers.CharField(source='user.address', required=False)
    
    class Meta:
        model = GuestProfile
        fields = ['first_name', 'last_name', 'email', 'phone', 'address', 
                  'nationality', 'passport_number', 'id_number', 'date_of_birth', 'preferences']
    
    def update(self, instance, validated_data):
        user_data = validated_data.pop('user', {})
        user = instance.user
        
        for attr, value in user_data.items():
            setattr(user, attr, value)
        user.save()
        
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        
        return instance