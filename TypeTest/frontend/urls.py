from django.urls import path, include
from . import views

urlpatterns = [
    path('', views.homepage),
    path("commands/", views.commands),
    path("commands/<str:command>", views.commands),
]
