# apps/dashboard/urls.py
from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='home'),
    path('expenses/', views.all_expenses, name='expenses'),
    path('expenses/<int:expense_id>/', views.expense_detail, name='expense_detail'),
]