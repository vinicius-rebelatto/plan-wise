# apps/accounts/models.py

from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils.translation import gettext_lazy as _

class Account(AbstractUser):
    username = models.CharField(max_length=150, blank=True, null=True, unique=True)
    telefone = models.CharField(max_length=15, blank=True, null=True)

    # Campos de data/hora
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    # Defina o campo de login (opcional, o padrão é 'username')
    USERNAME_FIELD = 'email'  # Use 'email' como campo de login
    REQUIRED_FIELDS = []  # Remova 'username' dos campos obrigatórios

    # Garanta que o campo 'email' seja único
    email = models.EmailField(_('email address'), unique=True)

    def __str__(self):
        return self.email  # Use o email como identificador