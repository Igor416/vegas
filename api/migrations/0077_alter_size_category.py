# Generated by Django 4.1.1 on 2022-10-20 15:40

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0076_size_discount_alter_bedsheets_sizes_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='size',
            name='category',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='api.category', verbose_name='Категория'),
        ),
    ]
