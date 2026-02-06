from django.contrib import admin
from .models import TrackedWebsite, UserProfile

# Register your models here.
admin.site.register(TrackedWebsite)
admin.site.register(UserProfile)