# Generated by Django 4.0.5 on 2022-06-26 14:45

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0002_remove_bed_category_remove_bed_country_and_more'),
    ]

    operations = [
        migrations.CreateModel(
            name='Stand',
            fields=[
                ('id', models.AutoField(default=1, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=32, verbose_name='Название')),
                ('garanty', models.IntegerField(verbose_name='Гарантийный срок')),
                ('width', models.IntegerField(verbose_name='Ширина')),
                ('length', models.IntegerField(verbose_name='Длина')),
                ('height', models.IntegerField(verbose_name='Высота изголовья')),
                ('category', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.category', verbose_name='Категория')),
                ('country', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='countryS', to='api.choice', verbose_name='Страна производства')),
                ('material', models.ForeignKey(blank=True, on_delete=django.db.models.deletion.CASCADE, related_name='materialS', to='api.choice', verbose_name='Материал обивки')),
            ],
            options={
                'verbose_name': 'тумба',
                'verbose_name_plural': 'тумбы',
            },
        ),
        migrations.CreateModel(
            name='Pillow',
            fields=[
                ('id', models.AutoField(default=1, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=32, verbose_name='Название')),
                ('garanty', models.IntegerField(verbose_name='Гарантийный срок')),
                ('width', models.IntegerField(verbose_name='Ширина')),
                ('length', models.IntegerField(verbose_name='Длина')),
                ('height', models.IntegerField(verbose_name='Справочная высота')),
                ('cover', models.BooleanField(verbose_name='Съемный чехол')),
                ('age', models.ManyToManyField(related_name='ageP', to='api.choice', verbose_name='Для возраста')),
                ('category', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.category', verbose_name='Категория')),
                ('country', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='countryP', to='api.choice', verbose_name='Страна производства')),
                ('material', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='materialP', to='api.choice', verbose_name='Материал наполнения')),
                ('package', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='packageP', to='api.choice', verbose_name='Упаковка')),
                ('tissue', models.ManyToManyField(related_name='tissueP', to='api.choice', verbose_name='Ткань чехла')),
            ],
            options={
                'verbose_name': 'подушка',
                'verbose_name_plural': 'подушки',
            },
        ),
        migrations.CreateModel(
            name='MattressPads',
            fields=[
                ('id', models.AutoField(default=1, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=32, verbose_name='Название')),
                ('garanty', models.IntegerField(verbose_name='Гарантийный срок')),
                ('height', models.IntegerField(verbose_name='Высота')),
                ('cover', models.BooleanField(verbose_name='Съемный чехол')),
                ('binding', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='bindingMP', to='api.choice', verbose_name='Крепление')),
                ('category', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.category', verbose_name='Категория')),
                ('country', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='countryMP', to='api.choice', verbose_name='Страна производства')),
                ('tissue', models.ManyToManyField(related_name='tissueMP', to='api.choice', verbose_name='Ткань чехла')),
                ('type', models.ManyToManyField(related_name='typeMP', to='api.choice', verbose_name='Тип наматрасника')),
            ],
            options={
                'verbose_name': 'наматрасник',
                'verbose_name_plural': 'наматрасники',
            },
        ),
        migrations.CreateModel(
            name='Mattrass',
            fields=[
                ('id', models.AutoField(default=1, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=32, verbose_name='Название')),
                ('garanty', models.IntegerField(verbose_name='Гарантийный срок')),
                ('height', models.IntegerField(verbose_name='Высота')),
                ('max_pressure', models.IntegerField(verbose_name='Макс. нагрузка')),
                ('springs', models.IntegerField(verbose_name='Кол-во пружин')),
                ('lifetime', models.IntegerField(verbose_name='Срок Службы')),
                ('cover', models.BooleanField(verbose_name='Съемный чехол')),
                ('age', models.ManyToManyField(related_name='ageM', to='api.choice', verbose_name='Для возраста')),
                ('category', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.category', verbose_name='Категория')),
                ('collection', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='collectionM', to='api.choice', verbose_name='Коллекция')),
                ('construction', models.ManyToManyField(related_name='constructionM', to='api.choice', verbose_name='Конструкция')),
                ('country', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='countryM', to='api.choice', verbose_name='Страна производства')),
                ('package', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='packageM', to='api.choice', verbose_name='Упаковка')),
                ('rigidity1', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='rigidity1M', to='api.choice', verbose_name='Уровень жесткости стороны 1')),
                ('rigidity2', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='rigidity2M', to='api.choice', verbose_name='Уровень жесткости стороны 2')),
                ('springblock', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='springblockM', to='api.choice', verbose_name='Пружинный блок')),
                ('type', models.ManyToManyField(related_name='typeM', to='api.choice', verbose_name='Тип матраса')),
            ],
            options={
                'verbose_name': 'матрас',
                'verbose_name_plural': 'матрасы',
            },
        ),
        migrations.CreateModel(
            name='Blanket',
            fields=[
                ('id', models.AutoField(default=1, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=32, verbose_name='Название')),
                ('density', models.IntegerField(verbose_name='Плотность наполнения')),
                ('age', models.ManyToManyField(related_name='ageBl', to='api.choice', verbose_name='Для возраста')),
                ('category', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.category', verbose_name='Категория')),
                ('color', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='colorBl', to='api.choice', verbose_name='Цвет одеяла')),
                ('country', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='countryBl', to='api.choice', verbose_name='Страна производства')),
                ('filling', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='fillingBl', to='api.choice', verbose_name='Наполнитель')),
                ('package', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='packageBl', to='api.choice', verbose_name='Упаковка')),
                ('tissue', models.ManyToManyField(related_name='tissueBl', to='api.choice', verbose_name='Ткань чехла')),
                ('type', models.ManyToManyField(related_name='typeBl', to='api.choice', verbose_name='Тип одеяла')),
            ],
            options={
                'verbose_name': 'одеяло',
                'verbose_name_plural': 'одеяла',
            },
        ),
        migrations.CreateModel(
            name='BedSheets',
            fields=[
                ('id', models.AutoField(default=1, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=32, verbose_name='Название')),
                ('category', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.category', verbose_name='Категория')),
                ('color', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='colorBS', to='api.choice', verbose_name='Цвет комплекта')),
                ('country', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='countryBS', to='api.choice', verbose_name='Страна производства')),
                ('material', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='materialBS', to='api.choice', verbose_name='Материал наполнения')),
                ('package', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='packageBS', to='api.choice', verbose_name='Упаковка')),
                ('type', models.ManyToManyField(related_name='typeBS', to='api.choice', verbose_name='Тип комплекта')),
            ],
            options={
                'verbose_name': 'постельное белье',
                'verbose_name_plural': 'постельное белье',
            },
        ),
        migrations.CreateModel(
            name='Bed',
            fields=[
                ('id', models.AutoField(default=1, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=32, verbose_name='Название')),
                ('garanty', models.IntegerField(verbose_name='Гарантийный срок')),
                ('width', models.IntegerField(verbose_name='Ширина')),
                ('length', models.IntegerField(verbose_name='Длина')),
                ('height', models.IntegerField(verbose_name='Высота изголовья')),
                ('lifetime', models.IntegerField(verbose_name='Срок Службы')),
                ('mattrass_included', models.BooleanField(verbose_name='Матрас в комплекте')),
                ('basis_included', models.BooleanField(verbose_name='Основание в комплекте')),
                ('category', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.category', verbose_name='Категория')),
                ('country', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='countryB', to='api.choice', verbose_name='Страна производства')),
                ('material', models.ForeignKey(blank=True, on_delete=django.db.models.deletion.CASCADE, related_name='materialB', to='api.choice', verbose_name='Материал обивки')),
                ('type', models.ManyToManyField(related_name='typeB', to='api.choice', verbose_name='Вид кровати')),
                ('wood', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='woodB', to='api.choice', verbose_name='Порода древесины')),
            ],
            options={
                'verbose_name': 'мебель',
                'verbose_name_plural': 'мебель',
            },
        ),
        migrations.CreateModel(
            name='Basis',
            fields=[
                ('id', models.AutoField(default=1, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=32, verbose_name='Название')),
                ('garanty', models.IntegerField(verbose_name='Гарантийный срок')),
                ('distance', models.IntegerField(verbose_name='Расстяоние межда ламелями')),
                ('width', models.IntegerField(verbose_name='Ширина ламели')),
                ('category', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.category', verbose_name='Категория')),
                ('country', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='countryBa', to='api.choice', verbose_name='Страна производства')),
                ('recomended', models.ManyToManyField(related_name='recomendedBa', to='api.mattrass', verbose_name='Рекомендовано для матрассов')),
            ],
            options={
                'verbose_name': 'основание',
                'verbose_name_plural': 'основания',
            },
        ),
    ]