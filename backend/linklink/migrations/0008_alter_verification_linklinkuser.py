# Generated by Django 4.1 on 2022-11-07 13:25

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('linklink', '0007_alter_linklinkuser_imgurl'),
    ]

    operations = [
        migrations.AlterField(
            model_name='verification',
            name='linklinkuser',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='linklink.linklinkuser'),
        ),
    ]