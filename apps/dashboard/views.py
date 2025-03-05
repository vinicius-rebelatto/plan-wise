# dashboard/views.py
from django.contrib.auth.decorators import login_required
from django.shortcuts import render

@login_required
def home(request):
    contexto = {
        'mensagem': 'Bem-vindo ao meu site dinâmico!',
    }
    return render(request, './dashboard.html', contexto)