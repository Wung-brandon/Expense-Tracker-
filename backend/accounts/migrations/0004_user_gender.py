# Generated by Django 5.1 on 2024-08-24 12:17

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("accounts", "0003_alter_profile_phone_number"),
    ]

    operations = [
        migrations.AddField(
            model_name="user",
            name="gender",
            field=models.CharField(
                choices=[("MALE", "MALE"), ("FEMALE", "FEMALE"), ("OTHER", "OTHER")],
                default="OTHER",
                max_length=100,
            ),
        ),
    ]
