# Generated by Django 4.1 on 2022-11-15 05:06

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('linklink', '0015_remove_chatroom_chatlogs_remove_chatroom_users_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='linklinkuser',
            name='imgUrl',
        ),
        migrations.AddField(
            model_name='profile',
            name='imgUrl',
            field=models.CharField(default='https://catadoptionteam.org/wp-content/uploads/2021/07/Homepage-MiddleBox-768x512.jpg', max_length=400),
        ),
    ]
