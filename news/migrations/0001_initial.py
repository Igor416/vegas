# Generated by Django 3.1.3 on 2022-08-10 13:42

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Banner',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('banner_en', models.ImageField(upload_to='banners', verbose_name='Баннер (en)')),
                ('banner_ru', models.ImageField(upload_to='banners', verbose_name='Баннер (ru)')),
                ('banner_ro', models.ImageField(upload_to='banners', verbose_name='Баннер (ro)')),
            ],
            options={
                'verbose_name': 'баннер',
                'verbose_name_plural': 'баннеры',
            },
        ),
    ]
