# apps/dashboard/urls.py
from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='home'),
    path('expenses/', views.all_expenses, name='expenses'),
    path('expenses/<int:expense_id>/', views.expense_detail, name='expense_detail'),
    path('expenses/create/', views.new_expense, name='create_expense'),
    path('expenses/delete/<int:expense_id>', views.delete_expense, name='delete_expense'),
    path('expenses/update/<int:expense_id>/', views.edit_expense, name='update_expense'),
    path('expenses/approve/<int:expense_id>/', views.approve_expense, name='approve_expense'),
    path('api/expenses_forecast/', views.expenses_forecast_api, name='api_expenses_forecast'),
]