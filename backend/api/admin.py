from django.contrib import admin
from .models import TrackedWebsite, TrackedWebsiteSnapshot, UserProfile

# Register your models here.
admin.site.register(TrackedWebsite)
admin.site.register(TrackedWebsiteSnapshot)
admin.site.register(UserProfile)