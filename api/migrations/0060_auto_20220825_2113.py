# Generated by Django 3.1.3 on 2022-08-25 18:13

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0059_auto_20220825_2105'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='basis',
            name='category',
        ),
        migrations.RemoveField(
            model_name='bed',
            name='category',
        ),
        migrations.RemoveField(
            model_name='bedsheets',
            name='category',
        ),
        migrations.RemoveField(
            model_name='blanket',
            name='category',
        ),
        migrations.RemoveField(
            model_name='category',
            name='id',
        ),
        migrations.RemoveField(
            model_name='choice',
            name='category',
        ),
        migrations.RemoveField(
            model_name='mattress',
            name='category',
        ),
        migrations.RemoveField(
            model_name='mattresspad',
            name='category',
        ),
        migrations.RemoveField(
            model_name='pillow',
            name='category',
        ),
        migrations.RemoveField(
            model_name='stand',
            name='category',
        ),
        migrations.AlterField(
            model_name='category',
            name='name',
            field=models.CharField(choices=[('Mattress', 'Матрас'), ('Pillow', 'Подушка'), ('MattressPad', 'Наматрасник'), ('Blanket', 'Одеяло'), ('BedSheets', 'Постельное белье'), ('Bed', 'Кровать'), ('Stand', 'Тумба'), ('Basis', 'Основание')], max_length=32, primary_key=True, serialize=False, unique=True, verbose_name='Название'),
        ),
        migrations.AlterField(
            model_name='size',
            name='product',
            field=models.CharField(blank=True, max_length=32, verbose_name='Название продукта'),
        ),
    ]
