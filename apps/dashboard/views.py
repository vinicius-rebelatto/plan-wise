# views.py
from django.shortcuts import render

def home(request):
    contexto = {
        'mensagem': 'Bem-vindo ao meu site dinâmico!',
    }
    return render(request, './dashboard.html', contexto)