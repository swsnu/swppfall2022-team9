# Generated by Django 4.1 on 2022-11-05 12:37

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('linklink', '0005_remove_linklinkuser_onechon_remove_profile_imageurl_and_more'),
    ]

    operations = [
        migrations.RenameField(
            model_name='linklinkuser',
            old_name='imageUrl',
            new_name='imgUrl',
        ),
    ]
