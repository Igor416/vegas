# Generated by Django 3.1.3 on 2022-10-01 14:02

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0074_auto_20220925_1916'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='bed',
            name='lifetime',
        ),
        migrations.AddField(
            model_name='bed',
            name='extra_length',
            field=models.IntegerField(default=0),
        ),
        migrations.AddField(
            model_name='bed',
            name='extra_width',
            field=models.IntegerField(default=0),
        ),
    ]
