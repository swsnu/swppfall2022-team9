# Generated by Django 4.1 on 2022-11-05 06:45

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('linklink', '0004_rename_user_verification_linklinkuser'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='linklinkuser',
            name='oneChon',
        ),
        migrations.RemoveField(
            model_name='profile',
            name='imageUrl',
        ),
        migrations.AddField(
            model_name='linklinkuser',
            name='imageUrl',
            field=models.CharField(default='https://catimage.com', max_length=200),
        ),
    ]
