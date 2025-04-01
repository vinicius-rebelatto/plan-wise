# apps/dashboard/signals.py
from django.core.cache import cache
from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from .models import Payable, ExpenseForecast


@receiver(post_save, sender=Payable)
@receiver(post_delete, sender=Payable)
def update_expense_forecast(sender, instance, **kwargs):
    """
    Atualiza o ExpenseForecast sempre que um Payable é criado, atualizado ou deletado
    """
    # Verifica se o status do Payable é "Pending" (ou apenas atualiza se não houver status)
    if hasattr(instance, 'status') and instance.status.name != "Pending":
        return

    # Chama o método para atualizar todas as previsões
    ExpenseForecast.update_forecast()

@receiver([post_save, post_delete], sender=Payable)
def clear_forecast_cache(sender, instance, **kwargs):
    # Limpa o cache da API quando um Payable é alterado
    cache_key = "your_cache_key"  # Ou use a URL completa
    cache.delete(cache_key)