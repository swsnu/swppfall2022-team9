# Generated by Django 4.1 on 2022-11-10 04:23

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('linklink', '0010_rename_user_profile_linklinkuser_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='linklinkuser',
            name='email_unique',
            field=models.EmailField(max_length=254, null=True, unique=True),
        ),
    ]