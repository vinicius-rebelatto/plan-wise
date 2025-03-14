#apps/dashboard/models.py
from django.db import models
from django.utils.functional import SimpleLazyObject

from apps.accounts.models import Account


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
    account = models.ForeignKey('accounts.Account', on_delete=models.CASCADE, related_name='expenses')
    category = models.ForeignKey(ExpenseCategory, on_delete=models.PROTECT, related_name='expenses')
    status = models.ForeignKey(ExpenseStatus, on_delete=models.PROTECT, related_name='expenses')
    value = models.DecimalField(max_digits=10, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if isinstance(self.account, SimpleLazyObject):
            self.account = Account.objects.get(pk=self.account.pk)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name
