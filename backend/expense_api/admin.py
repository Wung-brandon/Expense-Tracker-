from django.contrib import admin
from .models import Category, Expense, Income, Budget, MonthlyReport

# Register your models here.
class CategoryAdmin(admin.ModelAdmin):
    list_display = ["category", "created"]
    
class IncomeAdmin(admin.ModelAdmin):
    list_display = ["user", "source", "amount", "date", "created"]
    
class ExpenseAdmin(admin.ModelAdmin):
    list_display = ["user", "category", "amount", "date", "created"]
    
class BudgetAdmin(admin.ModelAdmin):
    list_display = ["user", "amount", "month", "created"]
    
class MonthReportAdmin(admin.ModelAdmin):
    list_display = ["user", "total_income", "total_expense", "total_budget", "total_balance", "date", "created"]
    
admin.site.register(Category, CategoryAdmin)
admin.site.register(Expense, ExpenseAdmin)
admin.site.register(Income, IncomeAdmin)
admin.site.register(Budget, BudgetAdmin)
admin.site.register(MonthlyReport, MonthReportAdmin)