# apps/dashboard/urls.py
from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='home'),
    path('expenses/', views.all_expenses, name='expenses'),
    path('expenses/<int:expense_id>/', views.expense_detail, name='expense_detail'),
    path('expenses/create/', views.new_expense, name='create_expense'),
    path('expenses/delete/<int:expense_id>', views.delete_expense, name='delete_expense'),
    #path('expenses/<int:expense_id>/update/', views.update_expense, name='update_expense'),
]