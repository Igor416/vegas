# Generated by Django 3.1.3 on 2022-07-28 09:28

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0033_remove_pillow_length_remove_pillow_width_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='video',
            name='video',
            field=models.URLField(verbose_name='Ссылка на видео'),
        ),
    ]