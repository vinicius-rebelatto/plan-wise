# apps/dashboard/views.py
from django.contrib import messages  # Correção aqui
from django.contrib.auth.decorators import login_required
from django.shortcuts import render, redirect

from apps.accounts.models import Account
from apps.dashboard.models import Expense, ExpenseCategory, ExpenseStatus


@login_required
def home(request):
    contexto = {
        'mensagem': 'Bem-vindo ao meu site dinâmico!',
    }
    return render(request, './dashboard.html', contexto)


@login_required
def all_expenses(request):
    if request.method == 'POST':
        # Tratando o envio de nova despesa
        name = request.POST['name']
        description = request.POST['description']
        category_id = request.POST['category']
        value = request.POST['value']

        try:
            # Validando e criando a nova despesa
            category = ExpenseCategory.objects.get(pk=category_id)
            status = ExpenseStatus.objects.get(pk=1)
            Expense.objects.create(
                name=name,
                description=description,
                category=category,
                status=status,
                value=value,
                account=request.user  # Usando request.user diretamente
            )
            messages.success(request, 'A nova despesa foi cadastrada com sucesso!')
            return redirect('all_expenses')
        except ExpenseCategory.DoesNotExist:
            messages.error(request, 'Categoria de despesa não encontrada.')  # Funcionará agora
        except Exception as e:
            messages.error(request, f'Erro ao cadastrar a despesa: {e}')  # Funcionará agora

    # Recupera todos os dados da tabela dashboard_expense no banco de dados ou no caso a model Expenses
    expenses = Expense.objects.all()
    categories = ExpenseCategory.objects.all()
    contexto = {
        'expenses': expenses,
        'categories': categories,
    }
    return render(request, './expenses.html', contexto)


def expense_detail(request, expense_id):
    contexto = {
        'expense': Expense.objects.get(pk=expense_id),
    }
    return render(request, './expense_info.html', contexto)