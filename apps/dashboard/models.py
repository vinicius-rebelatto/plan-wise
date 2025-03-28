#apps/dashboard/models.py
from django.db import models
from apps.accounts.models import Account
from dateutil.relativedelta import relativedelta
from datetime import date

# Create your models here.
class ExpenseCategory(models.Model):
    name = models.CharField(max_length=100, blank=False, null=False, unique=True)

    def __str__(self):
            return self.name

class ExpenseStatus(models.Model):
    name = models.CharField(max_length=100, blank=False, null=False, unique=True)
    def __str__(self):
        return self.name

class Expense(models.Model):
    name = models.CharField(max_length=100, blank=False, null=False)
    description = models.TextField(blank=True, default="")
    account = models.ForeignKey(Account, on_delete=models.CASCADE, related_name='expenses')
    category = models.ForeignKey(ExpenseCategory, on_delete=models.PROTECT, related_name='expenses')
    status = models.ForeignKey(ExpenseStatus, on_delete=models.PROTECT, related_name='expenses')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name


class Recurrency(models.Model):
    name = models.CharField(max_length=100, blank=False, null=False, unique=True)
    def __str__(self):
        return self.name


class ApprovalStatus(models.Model):
    name = models.CharField(max_length=100, blank=False, null=False, unique=True)
    def __str__(self):
        return self.name


class ExpenseRequest(models.Model):
    expense = models.ForeignKey(Expense, on_delete=models.CASCADE, related_name='requests')
    account = models.ForeignKey('accounts.Account', on_delete=models.CASCADE, related_name='requests')
    fixed_cost = models.BooleanField(blank=False, null=False)
    fixed_term = models.BooleanField(blank=False, null=False)
    from_date = models.DateField(blank=False, null=False)
    total_value = models.DecimalField(max_digits=10, decimal_places=2)
    installments = models.IntegerField(blank=False, null=False)
    installments_value = models.DecimalField(max_digits=10, decimal_places=2)
    recurrency = models.ForeignKey(Recurrency, on_delete=models.PROTECT, related_name='requests')
    approval_status = models.ForeignKey(ApprovalStatus, on_delete=models.PROTECT, related_name='requests')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.expense.name

    def create_payables(self):
        if not hasattr(self, 'expense'):
            raise ValueError("ExpenseRequest must be related to an Expense")

        if not self.from_date:
            raise ValueError("from_date must be set")

        if float(self.installments_value) <= 0:
            raise ValueError("installments_value must be positive")

        # First, delete any existing payables for this request
        self.payables.all().delete()

        # Ensure from_date is a date object (not a string)
        if isinstance(self.from_date, str):
            from_date = date.fromisoformat(self.from_date)  # Parse if it's a string
        else:
            from_date = self.from_date  # Assume it's already a date/datetime

        # Get the Pending status once
        pending_status = PayableStatus.objects.get(name='Pending')

        for month in range(int(self.installments)):
            try:
                due_date = from_date + relativedelta(months=month)
                Payable.objects.create(
                    expense=self.expense,
                    expense_request=self,
                    due_date=due_date,
                    amount=self.installments_value,
                    status=pending_status
                )
            except Exception as e:
                raise ValueError(f"Error creating payable for month {month}: {str(e)}")

        return self.payables.all()


class PayableStatus(models.Model):
    name = models.CharField(max_length=100, blank=False, null=False, unique=True)
    def __str__(self):
        return self.name


class Payable(models.Model):
    expense = models.ForeignKey(Expense, on_delete=models.CASCADE, related_name='payables')
    expense_request = models.ForeignKey(ExpenseRequest, on_delete=models.CASCADE, related_name='payables')
    due_date = models.DateField(blank=False, null=False)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.ForeignKey(PayableStatus, on_delete=models.PROTECT, related_name='payables', default=1)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    def __str__(self):
        return f'{self.expense.name} - {self.due_date}'