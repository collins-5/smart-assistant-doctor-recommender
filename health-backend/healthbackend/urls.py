# myproject/urls.py
from django.contrib import admin
from django.urls import path
from django.views.decorators.csrf import csrf_exempt
from django.views.generic import TemplateView
from graphene_django.views import GraphQLView

urlpatterns = [
    # Root → nice home page
    path('', TemplateView.as_view(template_name="home.html"), name="home"),

    path('admin/', admin.site.urls),
    path('graphql/', csrf_exempt(GraphQLView.as_view(graphiql=True)), name="graphql"),
]