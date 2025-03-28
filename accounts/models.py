from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.utils.translation import gettext_lazy as _

class UserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('Users must have an email address')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('role', User.Roles.ADMIN)
        
        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')
        
        return self.create_user(email, password, **extra_fields)

class User(AbstractUser):
    class Roles(models.TextChoices):
        ADMIN = 'admin', _('Admin')
        MANAGER = 'manager', _('Manager')
        RECEPTIONIST = 'receptionist', _('Receptionist')
        HOUSEKEEPING = 'housekeeping', _('Housekeeping')
        GUEST = 'guest', _('Guest')
    
    username = None
    email = models.EmailField(_('email address'), unique=True)
    role = models.CharField(max_length=20, choices=Roles.choices, default=Roles.GUEST)
    phone = models.CharField(max_length=15, blank=True)
    address = models.TextField(blank=True)
    profile_picture = models.ImageField(upload_to='profile_pictures/', null=True, blank=True)
    date_joined = models.DateTimeField(auto_now_add=True)
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []
    
    objects = UserManager()
    
    def __str__(self):
        return self.email
    
    @property
    def full_name(self):
        return f"{self.first_name} {self.last_name}"
    
    @property
    def is_admin(self):
        return self.role == self.Roles.ADMIN
    
    @property
    def is_manager(self):
        return self.role == self.Roles.MANAGER
    
    @property
    def is_receptionist(self):
        return self.role == self.Roles.RECEPTIONIST
    
    @property
    def is_housekeeping(self):
        return self.role == self.Roles.HOUSEKEEPING
    
    @property
    def is_guest(self):
        return self.role == self.Roles.GUEST
    
    @property
    def is_staff_member(self):
        return self.role in [
            self.Roles.ADMIN, 
            self.Roles.MANAGER, 
            self.Roles.RECEPTIONIST, 
            self.Roles.HOUSEKEEPING
        ]

class StaffProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='staff_profile')
    employee_id = models.CharField(max_length=20, unique=True)
    department = models.CharField(max_length=50)
    position = models.CharField(max_length=50)
    hire_date = models.DateField()
    
    def __str__(self):
        return f"{self.user.full_name} - {self.position}"

class GuestProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='guest_profile')
    nationality = models.CharField(max_length=50, blank=True)
    passport_number = models.CharField(max_length=50, blank=True)
    id_number = models.CharField(max_length=50, blank=True)
    date_of_birth = models.DateField(null=True, blank=True)
    preferences = models.JSONField(default=dict, blank=True)
    
    def __str__(self):
        return f"{self.user.full_name} - {self.nationality}"
