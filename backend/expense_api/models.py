# from typing import Iterable
from django.db import models
from django.db.models import Sum
from decimal import Decimal
from django.db.models.signals import post_save
from django.dispatch import receiver
from accounts.models import User
from django.utils import timezone
import datetime
from dateutil.relativedelta import relativedelta
from accounts.utils import send_notification


class Income(models.Model):
    DEFAULT_SOURCE = (
        ("SALARY", "SALARY"),
        ("BUSINESS", "BUSINESS"),
        ("SIDE_HUSTLE", "SIDE_HUSTLE"),
        ("INVESTMENTS", "INVESTMENTS"),
        ("INHERITANCE", "INHERITANCE"),
        ("GIFTS", "GIFTS"),
        ("OTHERS", "OTHERS"),
    )
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    source = models.CharField(max_length=150, choices=DEFAULT_SOURCE, default="SALARY")
    description = models.TextField()
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    date = models.DateField(default=timezone.now)  # Ensure this is a DateField
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name_plural = "Income"
        ordering = ["-date"]
    
    def __str__(self):
        return f"{self.user.username} - {self.source} - {self.amount}"
    
    def save(self, *args, **kwargs):
        if self.amount < 0:
            raise ValueError("Amount cannot be negative")
        return super().save(*args, **kwargs)

class Expense(models.Model):
    DEFAULT_EXPENSE_CATEGORY = (
        ("FOOD", "FOOD"),
        ("TRANSPORTATION", "TRANSPORTATION"),
        ("HOUSING", "HOUSING"),
        ("INSURANCE", "INSURANCE"),
        ("DEBT", "DEBT"),
        ("ENTERTAINMENT", "ENTERTAINMENT"),
        ("CLOTHING", "CLOTHING"),
        ("HEALTH_AND_WELLNESS", "HEALTH_AND_WELLNESS"),
        ("PERSONAL_CARE", "PERSONAL_CARE"),
        ("EDUCATION", "EDUCATION"),
        ("GIFTS", "GIFTS"),
        ("ONLINE_SERVICES", "ONLINE_SERVICES"),
        ("OTHERS", "OTHERS"),
    )
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    category = models.CharField(choices=DEFAULT_EXPENSE_CATEGORY, default="FOOD", max_length=200)
    description = models.TextField()
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    date = models.DateField(default=timezone.now)
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name_plural = "Expense"
        ordering = ["-date"]
    
    def __str__(self):
        return f"{self.user.username} - {self.category} - {self.amount}"
    
    def save(self, *args, **kwargs):
        if self.amount < 0:
            raise ValueError("Amount cannot be negative")
         # Set the start and end date for the selected month
        start_date = self.date.replace(day=1)
        end_date = (start_date + relativedelta(months=1)) - datetime.timedelta(days=1)
        
        budget = Budget.objects.filter(user=self.user, month__year=self.date.year, month__month=self.date.month).aggregate(total_budget=Sum('amount'))['total_budget'] or 0
        # Determine the month and year from the date field
        start_date = self.date.replace(day=1)
        end_date = (start_date + relativedelta(months=1)) - datetime.timedelta(days=1)

        # Calculate total income for the month
        total_income = Income.objects.filter(user=self.user, date__range=[start_date, end_date]).aggregate(total_income=Sum('amount'))['total_income'] or 0

        # Calculate total expenses already recorded for the month
        total_expense = Expense.objects.filter(user=self.user, date__range=[start_date, end_date]).aggregate(total_expense=Sum('amount'))['total_expense'] or 0

        # Calculate total budget for the month
        # total_budget = Budget.objects.filter(user=self.user, month=start_date).aggregate(total_budget=Sum('amount'))['total_budget'] or 0
        new_total_expense = total_expense + self.amount
        if budget == 0:
            # user = self.user.email
            # subject = f"Set Budget for {self.date.strftime('%B %Y')}"
            # message = {
            #     'Budget Not Set',
            #     f'Hi {self.user.username} \n You need to set a budget for {self.date.strftime("%B %Y")} before adding expenses.',
            #     'expenseeye24@gmail.com',
            # }
            # send_notification(user, message, subject)
            raise ValueError("Budget not set or is zero for the selected month. Please set a budget")
        
        elif total_income == 0:
            raise ValueError("Income not set or is zero for the selected month. Please seta budget")
        elif new_total_expense > total_income:
            raise ValueError("Total expenses cannot surpass total income for the month.")
        elif new_total_expense > budget:
            # user = self.user.email
            # subject = f"Expense Exceeds the set Budget for {self.date.strftime('%B %Y')}"
            # message = {
            #     'Your Expense Exceeds Income',
            #     f'Hi {self.user.username} \n Your total expenses for {self.date.strftime("%B %Y")} exceeds your set budget',
            #     'expenseeye24@gmail.com',
            # }
            # send_notification(user, message, subject)
            raise ValueError("Total expenses cannot exceed the allocated budget for the selected month.")
        elif budget and (budget - new_total_expense) <= Decimal("3000"):
            # user = self.user.email
            # subject = f"Approaching Budget Limit for {self.date.strftime('%B %Y')}"
            # message = {
            #     'Your Expense Exceeds Income',
            #     f'Hi {self.user.username} \n Your expenses are approaching your budget for {self.date.strftime("%B %Y")}.',
            #     'expenseeye24@gmail.com',
            # }
            return ValueError(f"Your expenses are approaching your budget for {self.date.strftime('%B %Y')}")
        
        return super().save(*args, **kwargs)
            

class Budget(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    month = models.DateField(default=timezone.now)
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)
    
    
    class Meta:
        verbose_name = "Budget"
    
    def __str__(self):
        return f"{self.user.username} - {self.month.strftime('%B %Y')} - {self.amount}"
    
    def save(self, *args, **kwargs):
        if self.amount < 0:
            raise ValueError("Amount cannot be negative")
        
        # Set the start and end date for the selected month
        start_date = self.month.replace(day=1)
        end_date = (start_date + relativedelta(months=1)) - datetime.timedelta(days=1)
        
        # Calculate the total income for the selected month
        total_income = Income.objects.filter(user=self.user, date__range=[start_date, end_date]).aggregate(total_income=Sum('amount'))['total_income'] or 0
        # Calculate total budget already set for the month
        total_budget = Budget.objects.filter(user=self.user, month=self.month).aggregate(total_budget=Sum('amount'))['total_budget'] or 0
        
        if total_income == 0:
            raise ValueError("No income found for the selected month. Please add income first before setting a budget.")
        if self.amount > total_income:
            raise ValueError("Budget amount cannot exceed total income for the selected month.")
        elif self.amount + total_budget > total_income:
            raise ValueError("Budget amount cannot exceed total income for the selected month.")
        
        super().save(*args, **kwargs)
class MonthlyReport(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    date = models.DateField(default=timezone.now)
    total_income = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    total_expense = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    total_balance = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    total_budget = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = "Monthly Report"
    
    def __str__(self):
        return f"{self.user.username} - {self.date.strftime('%B %Y')} - Balance: {self.total_balance}"

    @classmethod
    def update_report(cls, user, date):
        today_date = datetime.date.today()
        a_month_ago = today_date - relativedelta(months=1)

        income = Income.objects.filter(user=user, date__range=[today_date, a_month_ago]).aggregate(total_income=Sum('amount'))['total_income'] or 0
        expenses = Expense.objects.filter(user=user, date__range=[today_date, a_month_ago]).aggregate(total_expense=Sum('amount'))['total_expense'] or 0
        budget = Budget.objects.filter(user=user, month__year=date.year, month__month=date.month).aggregate(total_budget=Sum('amount'))['total_budget'] or 0

        total_balance = income - expenses

        report, created = cls.objects.get_or_create(user=user, date=today_date)
        report.total_income = income
        report.total_expense = expenses
        report.total_balance = total_balance
        report.total_budget = budget
        report.save()

@receiver(post_save, sender=Income)
@receiver(post_save, sender=Expense)
@receiver(post_save, sender=Budget)
def update_monthly_report(sender, instance, **kwargs):
    if isinstance(instance, Income):
        date = instance.date
    elif isinstance(instance, Expense):
        date = instance.date
    elif isinstance(instance, Budget):
        date = instance.month

    MonthlyReport.update_report(instance.user, date)