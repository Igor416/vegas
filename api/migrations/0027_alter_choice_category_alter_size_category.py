# Generated by Django 4.0.5 on 2022-07-17 12:55

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0026_alter_category_desc_en_alter_category_desc_ro_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='choice',
            name='category',
            field=models.ManyToManyField(related_name='categoryC', to='api.category'),
        ),
        migrations.AlterField(
            model_name='size',
            name='category',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.category'),
        ),
    ]