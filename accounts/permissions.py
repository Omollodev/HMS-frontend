from rest_framework import permissions

class IsAdminOrManager(permissions.BasePermission):
    def has_permission(self, request, view):
        return bool(
            request.user and 
            request.user.is_authenticated and 
            (request.user.is_admin or request.user.is_manager)
        )

class IsReceptionist(permissions.BasePermission):
    def has_permission(self, request, view):
        return bool(
            request.user and 
            request.user.is_authenticated and 
            (request.user.is_admin or request.user.is_manager or request.user.is_receptionist)
        )

class IsHousekeeping(permissions.BasePermission):
    def has_permission(self, request, view):
        return bool(
            request.user and 
            request.user.is_authenticated and 
            (request.user.is_admin or request.user.is_manager or request.user.is_housekeeping)
        )

class IsSelfOrAdmin(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.user.is_admin or request.user.is_manager:
            return True
            
        if hasattr(obj, 'user'):
            return obj.user == request.user
        return obj == request.user