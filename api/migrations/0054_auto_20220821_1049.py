# Generated by Django 3.1.3 on 2022-08-21 07:49

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0053_mattress_markers'),
    ]

    operations = [
        migrations.AddField(
            model_name='mattress',
            name='visible_markers',
            field=models.ManyToManyField(related_name='visible_markers', to='api.Marker', verbose_name='Маркеры'),
        ),
        migrations.AlterField(
            model_name='mattress',
            name='markers',
            field=models.ManyToManyField(related_name='markers', to='api.Marker'),
        ),
    ]