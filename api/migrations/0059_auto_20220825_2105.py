# Generated by Django 3.1.3 on 2022-08-25 18:05

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0058_auto_20220823_2233'),
    ]

    operations = [
        migrations.RenameField(
            model_name='size',
            old_name='category',
            new_name='product',
        ),
    ]