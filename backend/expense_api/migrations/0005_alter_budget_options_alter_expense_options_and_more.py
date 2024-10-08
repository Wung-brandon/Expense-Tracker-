# Generated by Django 5.1 on 2024-08-23 13:45

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ("expense_api", "0004_alter_expense_options_alter_income_options"),
    ]

    operations = [
        migrations.AlterModelOptions(
            name="budget",
            options={"verbose_name": "Budget"},
        ),
        migrations.AlterModelOptions(
            name="expense",
            options={"verbose_name_plural": "Expense"},
        ),
        migrations.AlterModelOptions(
            name="income",
            options={"verbose_name_plural": "Income"},
        ),
        migrations.AlterModelOptions(
            name="monthlyreport",
            options={"verbose_name": "Monthly Report"},
        ),
    ]
