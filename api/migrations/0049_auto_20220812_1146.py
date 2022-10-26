# Generated by Django 3.1.3 on 2022-08-12 08:46

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0048_auto_20220810_1642'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='mattress',
            name='construction',
        ),
        migrations.AddField(
            model_name='mattress',
            name='construction',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='construction', to='api.choice'),
        ),
    ]