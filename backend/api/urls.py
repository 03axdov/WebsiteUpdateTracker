from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TrackedWebsiteViewSet, CsrfView

router = DefaultRouter()
router.register(r"tracked-websites", TrackedWebsiteViewSet, basename="trackedwebsite")

urlpatterns = [
    path("", include(router.urls)),
    path("csrf/", CsrfView.as_view()),
]