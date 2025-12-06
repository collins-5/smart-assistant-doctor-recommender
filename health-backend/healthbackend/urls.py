# myproject/urls.py
from django.contrib import admin
from django.urls import path, include
from django.views.decorators.csrf import csrf_exempt
from django.views.generic import TemplateView
from graphene_django.views import GraphQLView
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('', TemplateView.as_view(template_name="home.html"), name="home"),
    
    # Fixed: added .html and trailing slash (optional but cleaner)
    path('profile-upload-test/', TemplateView.as_view(template_name="profile-upload-test.html")),
    
    path('admin/', admin.site.urls),
    path('graphql/', csrf_exempt(GraphQLView.as_view(graphiql=True)), name="graphql"),
    
    # API routes
    path('api/', include('core.urls')),
]

# THIS IS THE MOST IMPORTANT LINE — serves all your uploaded photos
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)