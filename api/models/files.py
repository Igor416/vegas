from django.db import models
from urllib.request import urlretrieve
from vegas.settings import BASE_DIR

class File(models.Model):
    folder = ''
    image = models.ImageField('Фото товара', upload_to=folder)

    def get_absolute_url(self):
        return f'/media/{self.folder}/{self.get_name()}.jpg'

    def get_name(self):
        return self.image.name.split('/')[-1].split('.')[0] #products/[name].jpg -> [name]

    class Meta:
        abstract = True

class Image(File):
    folder = 'products'
    image = models.ImageField('Фото товара', upload_to=folder)

    def __str__(self):
        name = self.get_name()
        if self.is_shortcut():
            name = name.replace('_', ' ')
            name += ' Для каталога'
        else:
            name = name.replace('_', ' ')
            name = ' '.join(name.split(' ')[:-1]) + ' № ' + name.split(' ')[-1]

        return name

    def is_shortcut(self):
        return not self.get_name().split('_')[-1].isdigit()

    class Meta:
        verbose_name = 'фотография'
        verbose_name_plural = 'фотографии'

class Video(File):
    folder = 'videos'
    video_id = models.CharField('Ссылка на видео', max_length=64, unique=True)

    def save(self, *args, **kwargs):
        if '=' in self.video_id:
            self.video_id = self.video_id.split('=')[-1]
        elif 'youtu.be' in self.video_id:
            self.video_id = self.video_id.split('/')[-1]
        self.image = urlretrieve(f'http://img.youtube.com/vi/{self.video_id}/hqdefault.jpg', str(BASE_DIR) + f'\media\\videos\{self.video_id}.jpg')[0]
        super().save(*args, **kwargs)

    def get_name(self):
        return self.video_id

    def __str__(self):
        return f'видео о товаре с id: {self.video_id}'

    class Meta:
        verbose_name = 'видео'
        verbose_name_plural = 'видео'
