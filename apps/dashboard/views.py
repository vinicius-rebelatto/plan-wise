# apps/dashboard/views.py
from django.contrib.auth.decorators import login_required
from django.shortcuts import render

from apps.dashboard.models import Expense


@login_required
def home(request):
    contexto = {
        'mensagem': 'Bem-vindo ao meu site dinâmico!',
    }
    return render(request, './dashboard.html', contexto)

def all_expenses(request):
    #Recupera todos os dados da tabela dashboard_expense no banco de dados ou no caso a model Expenses
    expenses = Expense.objects.all()
    contexto = {
        'expenses': expenses,
    }
    return render(request, './expenses.html', contexto)