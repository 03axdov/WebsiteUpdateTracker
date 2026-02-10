from rest_framework import serializers
from .models import TrackedWebsite, TrackedWebsiteSnapshot

class TrackedWebsiteSerializer(serializers.ModelSerializer):
    class Meta:
        model = TrackedWebsite
        fields = ("id", "url", "title", "description", "notify_email", "created_at", "last_scraped")
        read_only_fields = ("id", "created_at", "last_scraped")


class TrackedWebsiteSnapshotSerializer(serializers.ModelSerializer):
    class Meta:
        model = TrackedWebsiteSnapshot
        fields = "__all__"
        read_only_fields = [field.name for field in TrackedWebsiteSnapshot._meta.fields]