# Generated by Django 3.1.3 on 2022-08-23 19:29

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0054_auto_20220821_1049'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='layermattresspad',
            name='product',
        ),
        migrations.RemoveField(
            model_name='layermattresspad',
            name='technology',
        ),
        migrations.RemoveField(
            model_name='layerpillow',
            name='product',
        ),
        migrations.RemoveField(
            model_name='layerpillow',
            name='technology',
        ),
        migrations.AlterModelOptions(
            name='technology',
            options={'verbose_name': 'технология / слой', 'verbose_name_plural': 'технологии / слои'},
        ),
        migrations.RemoveField(
            model_name='mattress',
            name='structure',
        ),
        migrations.RemoveField(
            model_name='mattresspad',
            name='structure',
        ),
        migrations.RemoveField(
            model_name='pillow',
            name='structure',
        ),
        migrations.AddField(
            model_name='technology',
            name='isTechnology',
            field=models.BooleanField(default=False, verbose_name='Это технология? (или слой)'),
        ),
        migrations.DeleteModel(
            name='LayerMattress',
        ),
        migrations.DeleteModel(
            name='LayerMattressPad',
        ),
        migrations.DeleteModel(
            name='LayerPillow',
        ),
    ]
