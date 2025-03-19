# apps/dashboard/views.py
from django.contrib import messages  # Correção aqui
from django.contrib.auth.decorators import login_required
from django.shortcuts import render, redirect

from apps.accounts.models import Account
from apps.dashboard.models import Expense, ExpenseCategory, ExpenseStatus, Recurrency, ExpenseRequest, ApprovalStatus


@login_required
def home(request):
    contexto = {
        'mensagem': 'Bem-vindo ao meu site dinâmico!',
    }
    return render(request, './dashboard.html', contexto)


@login_required
def all_expenses(request):
    expenses = Expense.objects.all()
    categories = ExpenseCategory.objects.all()
    contexto = {
        'expenses': expenses,
        'categories': categories,
    }
    return render(request, './expenses.html', contexto)

@login_required()
def new_expense(request):
    if request.method == 'POST':
        name = request.POST['expense']
        description = request.POST['description']
        category_id = request.POST['category']
        user = request.user
        expense = create_expenses(name, description, category_id, user)
        fixed_cost = request.POST['fixed_cost']
        fixed_term = request.POST['fixed_term']
        print(f"Fixed cost: {fixed_cost}, term: {fixed_term}")
        from_date = request.POST['from-date']
        recurrency = request.POST['recurrency']
        total_value = request.POST['total-value']
        installments = request.POST['installments']
        installments_value = request.POST['installments-value']
        create_expense_request(expense, fixed_cost, fixed_term, from_date, recurrency, total_value, installments, installments_value)
        return redirect('expense_detail', expense.id)

    categories = ExpenseCategory.objects.all()
    recurrencies = Recurrency.objects.all()
    contexto = {
        'categories': categories,
        'recurrencies': recurrencies,
    }
    return render(request, './create_expense.html', contexto)


@login_required()
def expense_detail(request, expense_id):
    contexto = {
        'expense': Expense.objects.get(pk=expense_id),
    }
    return render(request, './expense_info.html', contexto)




def create_expenses(name, description, category_id, user):
    # Validando e criando a nova despesa
    category = ExpenseCategory.objects.get(pk=category_id)
    status = ExpenseStatus.objects.get(pk=1)
    expense = Expense.objects.create(
        name=name,
        description=description,
        category=category,
        status=status,
        account=user  # Usando request.user diretamente
    )
    expense.save()
    return expense

def create_expense_request(expense, fixed_cost, fixed_term, from_date, recurrency, total_value, installments, installments_value):
    approval_status =  ApprovalStatus.objects.get(pk=1)
    recurrency = Recurrency.objects.get(pk=recurrency)
    expense_req = ExpenseRequest.objects.create(
        expense=expense,
        account_id=expense.account.id,
        fixed_cost=fixed_cost,
        fixed_term=fixed_term,
        from_date=from_date,
        recurrency=recurrency,
        total_value=total_value,
        installments=installments,
        installments_value = installments_value,
        approval_status=approval_status
    )
    expense_req.save()