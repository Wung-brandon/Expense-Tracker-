# Generated by Django 5.1 on 2024-08-23 13:40

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ("expense_api", "0003_alter_expense_category_delete_category"),
    ]

    operations = [
        migrations.AlterModelOptions(
            name="expense",
            options={"verbose_name": "Expense"},
        ),
        migrations.AlterModelOptions(
            name="income",
            options={"verbose_name": "Income"},
        ),
    ]
