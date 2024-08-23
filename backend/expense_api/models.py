from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver
from accounts.models import User
from django.utils import timezone


class Income(models.Model):
    DEFAULT_SOURCE = (
        ("SALARY", "SALARY"),
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
    date = models.DateField()
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name_plural = "Income"
    
    def __str__(self):
        return f"{self.user.username} - {self.source} - {self.amount}"

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
    date = models.DateField()
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name_plural = "Expense"
    
    def __str__(self):
        return f"{self.user.username} - {self.category} - {self.amount}"

class Budget(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    month = models.DateField()
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = "Budget"
    
    def __str__(self):
        return f"{self.user.username} - {self.month.strftime('%B %Y')} - {self.amount}"

class MonthlyReport(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    date = models.DateField()
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
        start_date = date.replace(day=1)
        end_date = (start_date + timezone.timedelta(days=31)).replace(day=1)

        income = Income.objects.filter(user=user, date__range=[start_date, end_date]).aggregate(total_income=models.Sum('amount'))['total_income'] or 0
        expenses = Expense.objects.filter(user=user, date__range=[start_date, end_date]).aggregate(total_expense=models.Sum('amount'))['total_expense'] or 0
        budget = Budget.objects.filter(user=user, month__year=date.year, month__month=date.month).aggregate(total_budget=models.Sum('amount'))['total_budget'] or 0

        total_balance = income - expenses

        report, created = cls.objects.get_or_create(user=user, date=date)
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

    users = User.objects.all()
    for user in users:
        MonthlyReport.update_report(user, date)
