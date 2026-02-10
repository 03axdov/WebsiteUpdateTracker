from django.http import JsonResponse
from django.views.decorators.csrf import ensure_csrf_cookie
from django.utils.decorators import method_decorator
from rest_framework.views import APIView
from rest_framework import viewsets
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.decorators import action
from rest_framework.response import Response

from .serializers import TrackedWebsiteSerializer, TrackedWebsiteSnapshotSerializer
from .models import TrackedWebsite, TrackedWebsiteSnapshot


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
        
    @action(detail=True, methods=["get"], url_path="snapshots") 
    def snapshots(self, request, pk=None):
        website = self.get_object()  # already owner-filtered via get_queryset
        qs = website.snapshots.order_by("-created_at")
        serializer = TrackedWebsiteSnapshotSerializer(qs, many=True, context={"request": request})
        print(serializer.data)
        return Response(serializer.data)