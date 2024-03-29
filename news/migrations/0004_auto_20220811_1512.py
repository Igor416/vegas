# Generated by Django 3.1.3 on 2022-08-11 12:12

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('news', '0003_auto_20220811_1234'),
    ]

    operations = [
        migrations.AlterField(
            model_name='review',
            name='city',
            field=models.CharField(blank=True, max_length=16, verbose_name='Город'),
        ),
        migrations.AlterField(
            model_name='review',
            name='date',
            field=models.DateField(verbose_name='Дата'),
        ),
        migrations.AlterField(
            model_name='review',
            name='text',
            field=models.TextField(blank=True, verbose_name='Отзыв'),
        ),
        migrations.AlterField(
            model_name='review',
            name='title',
            field=models.CharField(blank=True, max_length=64, verbose_name='Заглавие'),
        ),
    ]
