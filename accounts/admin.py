from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.utils.translation import gettext_lazy as _
from .models import User, StaffProfile, GuestProfile

class StaffProfileInline(admin.StackedInline):
    model = StaffProfile
    can_delete = False

class GuestProfileInline(admin.StackedInline):
    model = GuestProfile
    can_delete = False

@admin.register(User)
class CustomUserAdmin(UserAdmin):
    list_display = ('email', 'first_name', 'last_name', 'role', 'is_active', 'is_staff', 'date_joined')
    list_filter = ('role', 'is_active', 'is_staff', 'date_joined')
    search_fields = ('email', 'first_name', 'last_name')
    ordering = ('email',)
    readonly_fields = ('date_joined', 'last_login')
    
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        (_('Personal info'), {'fields': ('first_name', 'last_name', 'phone', 'address', 'profile_picture')}),
        (_('Role'), {'fields': ('role',)}),
        (_('Permissions'), {
            'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions'),
        }),
        (_('Important dates'), {'fields': ('last_login', 'date_joined')}),
    )
    
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'password1', 'password2', 'first_name', 'last_name', 'role'),
        }),
    )
    
    def get_inlines(self, request, obj=None):
        if obj:
            if obj.role == User.Roles.GUEST:
                return [GuestProfileInline]
            elif obj.role != User.Roles.GUEST:
                return [StaffProfileInline]
        return []

@admin.register(StaffProfile)
class StaffProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'employee_id', 'position', 'department', 'hire_date')
    list_filter = ('department', 'position', 'hire_date')
    search_fields = ('user__email', 'user__first_name', 'user__last_name', 'employee_id')
    readonly_fields = ('user',)

@admin.register(GuestProfile)
class GuestProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'nationality', 'date_of_birth')
    list_filter = ('nationality',)
    search_fields = ('user__email', 'user__first_name', 'user__last_name', 'passport_number', 'id_number')
    readonly_fields = ('user',) 