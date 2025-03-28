# apps/dashboard/views.py
from django.contrib import messages  # Correção aqui
from django.contrib.auth.decorators import login_required
from django.db.models import Q, Sum
from django.shortcuts import render, redirect

from apps.dashboard.models import Expense, ExpenseCategory, ExpenseStatus, Recurrency, ExpenseRequest, ApprovalStatus, \
    Payable


@login_required
def home(request):
    contexto = {
        'mensagem': 'Bem-vindo ao meu site dinâmico!',
    }
    return render(request, './dashboard.html', contexto)


@login_required
def all_expenses(request):

    expenses_requests = ExpenseRequest.objects.all()

    # Query 2025
    amount_planned_2025 = Payable.objects.filter(
        Q(status__name='Pending') and Q(due_date__year=2025)
    ).aggregate(total=Sum('amount'))['total'] or 0
    # Query 2026
    amount_planned_2026 = Payable.objects.filter(
        Q(status__name='Pending') and Q(due_date__year=2026)
    ).aggregate(total=Sum('amount'))['total'] or 0

    contexto = {
        'expenses_requests': expenses_requests,
        'amount_planned_2025': amount_planned_2025,
        'amount_planned_2026': amount_planned_2026,
        'active_expenses': Expense.objects.filter(status__name='Active').count(),
        'waiting_expenses': Expense.objects.filter(status__name='Waiting').count(),
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
    expense = Expense.objects.get(pk=expense_id)
    expense_request = ExpenseRequest.objects.get(expense=expense)
    payables = Payable.objects.filter(expense_request=expense_request)
    recurrency = Recurrency.objects.all()
    contexto = {
        'expense': expense,
        'expense_request': expense_request,
        'recurrencies': recurrency,
        'payables': payables,
    }
    return render(request, './expense_info.html', contexto)


@login_required()
def delete_expense(request, expense_id):
    expense = Expense.objects.get(pk=expense_id)
    expense.delete()
    return redirect('expenses')


@login_required()
def edit_expense(request, expense_id):
    expense = Expense.objects.get(pk=expense_id)
    expense_request = ExpenseRequest.objects.get(expense=expense)
    if request.method == 'POST':
        try:
            total_value = float(request.POST['total-value'].replace('.', '').replace(',', '.'))
            installments_value = float(request.POST['installments-value'].replace('.', '').replace(',', '.'))
        except (ValueError, KeyError) as e:
            messages.error(request, "Erro ao processar os valores fornecidos.")
            return redirect('edit_expense', expense_id=expense_id)
        name = request.POST['expense']
        description = request.POST['description']
        category_id = request.POST['category']
        fixed_cost = request.POST['fixed_cost']
        fixed_term = request.POST['fixed_term']
        from_date = request.POST['from-date']
        recurrency = request.POST['recurrency']
        installments = request.POST['installments']
        expense.name = name
        expense.description = description
        expense.category = ExpenseCategory.objects.get(pk=category_id)
        expense.save()
        expense_request.fixed_cost = fixed_cost
        expense_request.fixed_term = fixed_term
        expense_request.from_date = from_date
        expense_request.recurrency = Recurrency.objects.get(pk=recurrency)
        expense_request.total_value = total_value
        expense_request.installments = installments
        expense_request.installments_value = installments_value
        expense_request.save()
        return redirect('expense_detail', expense.id)
    categories = ExpenseCategory.objects.all()
    status = ExpenseStatus.objects.all()
    recurrencies = Recurrency.objects.all()
    contexto = {
        'expense': expense,
        'expense_request': expense_request,
        'categories': categories,
        'status': status,
        'recurrencies': recurrencies,
    }
    return render(request, 'expense_edit.html', contexto)


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
    expense_req.create_payables()
    expense_req.save()


def approve_expense(request, expense_id):
    approved = request.GET.get('approved', 'False').lower() == 'true'  # Converte parâmetro GET para booleano

    expense = Expense.objects.get(pk=expense_id)
    expense_request = ExpenseRequest.objects.get(expense=expense)

    if approved:
        expense.status = ExpenseStatus.objects.get(pk=2)  # Aprovado
        expense_request.approval_status = ApprovalStatus.objects.get(pk=2)
    else:
        expense.status = ExpenseStatus.objects.get(pk=4)  # Rejeitado
        expense_request.approval_status = ApprovalStatus.objects.get(pk=3)

    expense.save()  # Não esqueça de salvar ambas as models!
    expense_request.save()

    return redirect('expenses')  # Redireciona para a lista de despesas