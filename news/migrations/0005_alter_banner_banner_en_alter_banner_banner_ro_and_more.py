# Generated by Django 4.1.1 on 2022-12-11 11:15

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('news', '0004_auto_20220811_1512'),
    ]

    operations = [
        migrations.AlterField(
            model_name='banner',
            name='banner_en',
            field=models.ImageField(upload_to='news', verbose_name='Баннер (en)'),
        ),
        migrations.AlterField(
            model_name='banner',
            name='banner_ro',
            field=models.ImageField(upload_to='news', verbose_name='Баннер (ro)'),
        ),
        migrations.AlterField(
            model_name='banner',
            name='banner_ru',
            field=models.ImageField(upload_to='news', verbose_name='Баннер (ru)'),
        ),
    ]
