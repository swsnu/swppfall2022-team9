# Generated by Django 4.1 on 2022-11-09 16:44

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('linklink', '0009_alter_linklinkuser_friendrequesttoken_and_more'),
    ]

    operations = [
        migrations.RenameField(
            model_name='profile',
            old_name='user',
            new_name='linklinkuser',
        ),
        migrations.RemoveField(
            model_name='profile',
            name='birthDate',
        ),
        migrations.RemoveField(
            model_name='profile',
            name='gender',
        ),
        migrations.AlterField(
            model_name='skilltag',
            name='name',
            field=models.CharField(choices=[('Frontend', 'Frontend'), ('Backend', 'Backend'), ('Software Engineering', 'Software Engineering'), ('Deep Learning', 'Deep Learning'), ('Machine Learning', 'Machine Learning'), ('DevOps', 'DevOps'), ('MLOps', 'MLOps'), ('Financial Engineering', 'Financial Engineering'), ('Consulting', 'Consulting'), ('Human Resources', 'Human Resources'), ('Entrepreneurship', 'Entrepreneurship'), ('Blockchain', 'Blockchain'), ('Accounting', 'Accounting')], max_length=30),
        ),
        migrations.CreateModel(
            name='JobExperience',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('company', models.CharField(max_length=50)),
                ('position', models.CharField(max_length=50)),
                ('dateStart', models.DateField()),
                ('dateEnd', models.DateField()),
                ('createdAt', models.DateTimeField(auto_now_add=True)),
                ('updatedAt', models.DateTimeField(auto_now=True)),
                ('profile', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='linklink.profile')),
            ],
        ),
    ]
