# Generated by Django 5.1 on 2024-08-23 16:35

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ("expense_api", "0008_alter_income_source"),
    ]

    operations = [
        migrations.AlterModelOptions(
            name="expense",
            options={"ordering": ["-date"], "verbose_name_plural": "Expense"},
        ),
        migrations.AlterModelOptions(
            name="income",
            options={"ordering": ["-date"], "verbose_name_plural": "Income"},
        ),
    ]
