from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver
from accounts.models import User
from django.utils import timezone

class Category(models.Model):
    DEFAULT_CATEGORY = (
        ("FOOD", "Food"),
        ("TRANSPORTATION", "Transportation"),
        ("HOUSING", "Housing"),
        ("INSURANCE", "Insurance"),
        ("DEBT", "Debt"),
        ("ENTERTAINMENT", "Entertainment"),
        ("CLOTHING", "Clothing"),
        ("HEALTH_AND_WELLNESS", "Health and Wellness"),
        ("PERSONAL_CARE", "Personal Care"),
        ("EDUCATION", "Education"),
        ("GIFTS", "Gifts")
    )
    
    category = models.CharField(max_length=150, choices=DEFAULT_CATEGORY, default="FOOD")
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name_plural = "Category"
        
    
    def __str__(self):
        return self.category

class Income(models.Model):
    DEFAULT_SOURCE = (
        ("SALARY", "Salary"),
        ("SIDE_HUSTLE", "Side Hustle"),
        ("INVESTMENTS", "Investments"),
        ("INHERITANCE", "Inheritance"),
        ("GIFTS", "Gifts"),
    )
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    source = models.CharField(max_length=150, choices=DEFAULT_SOURCE, default="SALARY")
    description = models.TextField()
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    date = models.DateField()
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.user.username} - {self.source} - {self.amount}"

class Expense(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    description = models.TextField()
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    date = models.DateField()
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.user.username} - {self.category} - {self.amount}"

class Budget(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    month = models.DateField()
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)
    
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
