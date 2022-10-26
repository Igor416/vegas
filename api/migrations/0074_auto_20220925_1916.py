# Generated by Django 3.1.3 on 2022-09-25 16:16

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0073_auto_20220905_1800'),
    ]

    operations = [
        migrations.AlterField(
            model_name='mattress',
            name='visible_markers',
            field=models.ManyToManyField(blank=True, related_name='visible_markers', to='api.Marker', verbose_name='Маркеры'),
        ),
        migrations.RemoveField(
            model_name='stand',
            name='material',
        ),
        migrations.AddField(
            model_name='stand',
            name='material',
            field=models.ManyToManyField(related_name='material', to='api.Choice'),
        ),
    ]