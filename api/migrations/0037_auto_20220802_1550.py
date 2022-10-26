# Generated by Django 3.1.3 on 2022-08-02 12:50

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0036_auto_20220729_2028'),
    ]

    operations = [
        migrations.CreateModel(
            name='Layer',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=32, verbose_name='Название')),
                ('quantity', models.SmallIntegerField(default=1, verbose_name='Количество')),
                ('image', models.ImageField(upload_to='images', verbose_name='Фотография')),
                ('desc', models.TextField(verbose_name='Описание')),
            ],
        ),
        migrations.CreateModel(
            name='Technology',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=32, verbose_name='Название')),
                ('image', models.ImageField(upload_to='images', verbose_name='Фотография')),
                ('desc', models.TextField(verbose_name='Описание')),
            ],
        ),
        migrations.AlterField(
            model_name='blanket',
            name='age',
            field=models.ManyToManyField(related_name='ageblanket', to='api.Choice'),
        ),
        migrations.AlterField(
            model_name='mattress',
            name='age',
            field=models.ManyToManyField(related_name='agemattress', to='api.Choice'),
        ),
        migrations.AlterField(
            model_name='mattresspad',
            name='cover',
            field=models.ManyToManyField(related_name='covermattresspad', to='api.Choice'),
        ),
        migrations.AlterField(
            model_name='pillow',
            name='age',
            field=models.ManyToManyField(related_name='agepillow', to='api.Choice'),
        ),
        migrations.AlterField(
            model_name='pillow',
            name='cover',
            field=models.ManyToManyField(related_name='coverpillow', to='api.Choice'),
        ),
        migrations.AddField(
            model_name='mattress',
            name='structure',
            field=models.ManyToManyField(related_name='structure_mattress', to='api.Layer'),
        ),
        migrations.AddField(
            model_name='mattress',
            name='technologies',
            field=models.ManyToManyField(related_name='technologies_mattress', to='api.Technology'),
        ),
        migrations.AddField(
            model_name='mattresspad',
            name='structure',
            field=models.ManyToManyField(related_name='structure_mattresspad', to='api.Layer'),
        ),
        migrations.AddField(
            model_name='mattresspad',
            name='technologies',
            field=models.ManyToManyField(related_name='technologies_mattresspad', to='api.Technology'),
        ),
        migrations.AddField(
            model_name='pillow',
            name='structure',
            field=models.ManyToManyField(related_name='structure_pillow', to='api.Layer'),
        ),
    ]