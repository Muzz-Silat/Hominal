from django.urls import path, re_path
from . import views

urlpatterns = [
    path('', views.homepage),
    path("commands/", views.commands),
    path("commands/<str:command>", views.commands),
    re_path(r'^.*$', views.commands),
]
