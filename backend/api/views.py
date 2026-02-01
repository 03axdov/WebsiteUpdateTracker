from django.http import JsonResponse
from django.views.decorators.csrf import ensure_csrf_cookie
from django.utils.decorators import method_decorator
from rest_framework.views import APIView
from rest_framework import viewsets
from rest_framework.permissions import AllowAny, IsAuthenticated
from .serializers import TrackedWebsiteSerializer
from .models import TrackedWebsite


@method_decorator(ensure_csrf_cookie, name="dispatch")
class CsrfView(APIView):
    permission_classes = [AllowAny]
    def get(self, request):
        return JsonResponse({"detail": "csrf cookie set"})
    
    
class TrackedWebsiteViewSet(viewsets.ModelViewSet):
    serializer_class = TrackedWebsiteSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return TrackedWebsite.objects.filter(owner=self.request.user).order_by("-created_at")

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)