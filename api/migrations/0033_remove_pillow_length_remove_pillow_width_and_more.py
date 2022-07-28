# Generated by Django 4.0.5 on 2022-07-23 06:17

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0032_remove_bedsheets_package_remove_blanket_package_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='pillow',
            name='length',
        ),
        migrations.RemoveField(
            model_name='pillow',
            name='width',
        ),
        migrations.RemoveField(
            model_name='stand',
            name='length',
        ),
        migrations.RemoveField(
            model_name='stand',
            name='width',
        ),
        migrations.AddField(
            model_name='pillow',
            name='sizes',
            field=models.ManyToManyField(related_name='sizes%(class)s', to='api.size', verbose_name='Размеры'),
        ),
        migrations.AddField(
            model_name='stand',
            name='sizes',
            field=models.ManyToManyField(related_name='sizes%(class)s', to='api.size', verbose_name='Размеры'),
        ),
        migrations.AlterField(
            model_name='basis',
            name='images',
            field=models.ManyToManyField(blank=True, related_name='images%(class)s', to='api.image', verbose_name='Фотографии товара'),
        ),
        migrations.AlterField(
            model_name='basis',
            name='sizes',
            field=models.ManyToManyField(related_name='sizes%(class)s', to='api.size', verbose_name='Размеры'),
        ),
        migrations.AlterField(
            model_name='bed',
            name='images',
            field=models.ManyToManyField(blank=True, related_name='images%(class)s', to='api.image', verbose_name='Фотографии товара'),
        ),
        migrations.AlterField(
            model_name='bed',
            name='sizes',
            field=models.ManyToManyField(related_name='sizes%(class)s', to='api.size', verbose_name='Размеры'),
        ),
        migrations.AlterField(
            model_name='bedsheets',
            name='images',
            field=models.ManyToManyField(blank=True, related_name='images%(class)s', to='api.image', verbose_name='Фотографии товара'),
        ),
        migrations.AlterField(
            model_name='bedsheets',
            name='sizes',
            field=models.ManyToManyField(related_name='sizes%(class)s', to='api.size', verbose_name='Размеры'),
        ),
        migrations.AlterField(
            model_name='blanket',
            name='images',
            field=models.ManyToManyField(blank=True, related_name='images%(class)s', to='api.image', verbose_name='Фотографии товара'),
        ),
        migrations.AlterField(
            model_name='blanket',
            name='sizes',
            field=models.ManyToManyField(related_name='sizes%(class)s', to='api.size', verbose_name='Размеры'),
        ),
        migrations.AlterField(
            model_name='choice',
            name='property_en',
            field=models.CharField(blank=True, max_length=64, verbose_name='Вариант выбора (en)'),
        ),
        migrations.AlterField(
            model_name='choice',
            name='property_ro',
            field=models.CharField(blank=True, max_length=64, verbose_name='Вариант выбора (ro)'),
        ),
        migrations.AlterField(
            model_name='choice',
            name='property_ru',
            field=models.CharField(max_length=64, verbose_name='Вариант выбора (ru)'),
        ),
        migrations.AlterField(
            model_name='mattress',
            name='images',
            field=models.ManyToManyField(blank=True, related_name='images%(class)s', to='api.image', verbose_name='Фотографии товара'),
        ),
        migrations.AlterField(
            model_name='mattress',
            name='sizes',
            field=models.ManyToManyField(related_name='sizes%(class)s', to='api.size', verbose_name='Размеры'),
        ),
        migrations.AlterField(
            model_name='mattresspad',
            name='images',
            field=models.ManyToManyField(blank=True, related_name='images%(class)s', to='api.image', verbose_name='Фотографии товара'),
        ),
        migrations.AlterField(
            model_name='mattresspad',
            name='sizes',
            field=models.ManyToManyField(related_name='sizes%(class)s', to='api.size', verbose_name='Размеры'),
        ),
        migrations.AlterField(
            model_name='pillow',
            name='images',
            field=models.ManyToManyField(blank=True, related_name='images%(class)s', to='api.image', verbose_name='Фотографии товара'),
        ),
        migrations.AlterField(
            model_name='stand',
            name='images',
            field=models.ManyToManyField(blank=True, related_name='images%(class)s', to='api.image', verbose_name='Фотографии товара'),
        ),
    ]
