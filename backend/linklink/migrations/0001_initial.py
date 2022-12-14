# Generated by Django 4.1 on 2022-10-28 15:11

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='ChatLog',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('message', models.TextField()),
                ('createdAt', models.DateTimeField(auto_now_add=True)),
            ],
        ),
        migrations.CreateModel(
            name='FriendRequest',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('status', models.CharField(choices=[('Pending', 'Pending'), ('Accepted', 'Accepted'), ('Rejected', 'Rejected')], default='Pending', max_length=8)),
                ('createdAt', models.DateTimeField(auto_now_add=True)),
                ('updatedAt', models.DateTimeField(auto_now=True)),
            ],
        ),
        migrations.CreateModel(
            name='LinkLinkUser',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nickname', models.CharField(max_length=50)),
                ('friendRequestToken', models.CharField(max_length=100)),
                ('emailValidated', models.BooleanField()),
                ('oneChon', models.ManyToManyField(to='linklink.friendrequest')),
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='QualityTag',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(choices=[('Sincere', 'Sincere'), ('Honest', 'Honest'), ('Understanding', 'Understanding'), ('Loyal', 'Loyal'), ('Truthful', 'Truthful'), ('Trustworthy', 'Trustworthy'), ('Intelligent', 'Intelligent'), ('Dependable', 'Dependable'), ('Open-Minded', 'Open-Minded'), ('Thoughtful', 'Thoughtful'), ('Wise', 'Wise'), ('Considerate', 'Considerate'), ('Good-Natured', 'Good-Natured'), ('Reliable', 'Reliable'), ('Mature', 'Mature'), ('Warm', 'Warm'), ('Earnest', 'Earnest'), ('Kind', 'Kind'), ('Friendly', 'Friendly'), ('Kind-Hearted', 'Kind-Hearted'), ('Happy', 'Happy'), ('Clean', 'Clean'), ('Interesting', 'Interesting'), ('Unselfish', 'Unselfish'), ('Good-Humored', 'Good-Humored'), ('Honorable', 'Honorable'), ('Humorous', 'Humorous'), ('Responsible', 'Responsible'), ('Cheerful', 'Cheerful'), ('Trustful', 'Trustful'), ('Warm-Hearted', 'Warm-Hearted'), ('Broad-Minded', 'Broad-Minded'), ('Gentle', 'Gentle'), ('Well-Spoken', 'Well-Spoken'), ('Educated', 'Educated'), ('Reasonable', 'Reasonable'), ('Companionable', 'Companionable'), ('Likable', 'Likable'), ('Trusting', 'Trusting'), ('Clever', 'Clever'), ('Pleasant', 'Pleasant'), ('Courteous', 'Courteous'), ('Quick-Witted', 'Quick-Witted'), ('Tactful', 'Tactful'), ('Helpful', 'Helpful'), ('Appreciative', 'Appreciative'), ('Imaginative', 'Imaginative'), ('Outstanding', 'Outstanding'), ('Self-Disciplined', 'Self-Disciplined'), ('Brilliant', 'Brilliant'), ('Enthusiastic', 'Enthusiastic'), ('Level-Headed', 'Level-Headed'), ('Polite', 'Polite'), ('Original', 'Original'), ('Smart', 'Smart'), ('Forgiving', 'Forgiving'), ('Sharp-Witted', 'Sharp-Witted'), ('Well-Read', 'Well-Read'), ('Ambitious', 'Ambitious'), ('Bright', 'Bright'), ('Respectful', 'Respectful'), ('Efficient', 'Efficient'), ('Good-Tempered', 'Good-Tempered'), ('Grateful', 'Grateful'), ('Conscientious', 'Conscientious'), ('Resourceful', 'Resourceful'), ('Alert', 'Alert'), ('Good', 'Good'), ('Witty', 'Witty'), ('Clear-Headed', 'Clear-Headed'), ('Kindly', 'Kindly'), ('Admirable', 'Admirable'), ('Patient', 'Patient'), ('Talented', 'Talented'), ('Perceptive', 'Perceptive'), ('Spirited', 'Spirited'), ('Sportsmanlike', 'Sportsmanlike'), ('Well-Mannered', 'Well-Mannered'), ('Cooperative', 'Cooperative'), ('Ethical', 'Ethical'), ('Intellectual', 'Intellectual'), ('Versatile', 'Versatile'), ('Capable', 'Capable'), ('Courageous', 'Courageous'), ('Constructive', 'Constructive'), ('Productive', 'Productive'), ('Progressive', 'Progressive'), ('Individualistic', 'Individualistic'), ('Observant', 'Observant'), ('Ingenious', 'Ingenious'), ('Lively', 'Lively'), ('Neat', 'Neat'), ('Punctual', 'Punctual'), ('Logical', 'Logical'), ('Prompt', 'Prompt'), ('Accurate', 'Accurate'), ('Sensible', 'Sensible'), ('Creative', 'Creative'), ('Self-Reliant', 'Self-Reliant'), ('Tolerant', 'Tolerant')], max_length=30)),
            ],
        ),
        migrations.CreateModel(
            name='SkillTag',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(choices=[('Computer Engineering', 'Computer Engineering'), ('Visual Design', 'Visual Design'), ('Economics', 'Economics'), ('Business Administration', 'Business Administration'), ('Psychology', 'Psychology'), ('Social Studies', 'Social Studies'), ('Mathematics', 'Mathematics'), ('Statistics', 'Statistics'), ('Physics', 'Physics'), ('Chemistry', 'Chemistry'), ('Biology', 'Biology'), ('Earch Sciences', 'Earch Sciences'), ('Law', 'Law'), ('Medicine', 'Medicine'), ('Pharmacy', 'Pharmacy'), ('undergraduate', 'undergraduate'), ('graduate', 'graduate'), ('BA', 'BA'), ('MA', 'MA'), ('PhDFrontend', 'PhDFrontend'), ('Backend', 'Backend'), ('Software Engineering', 'Software Engineering'), ('Deep Learning', 'Deep Learning'), ('Machine Learning', 'Machine Learning'), ('DevOps', 'DevOps'), ('MLOps', 'MLOps'), ('English', 'English'), ('Korean', 'Korean'), ('Japanese', 'Japanese'), ('Chinese', 'Chinese'), ('Spanish', 'Spanish'), ('French', 'French'), ('Italian', 'Italian'), ('Financial Engineering', 'Financial Engineering'), ('Consulting', 'Consulting'), ('Human Resources', 'Human Resources'), ('Entrepreneurship', 'Entrepreneurship'), ('Blockchain', 'Blockchain'), ('Accounting', 'Accounting')], max_length=30)),
            ],
        ),
        migrations.CreateModel(
            name='Verification',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('token', models.CharField(max_length=100)),
                ('createdAt', models.DateTimeField(auto_now_add=True)),
                ('expiredAt', models.DateTimeField()),
                ('purpose', models.CharField(choices=[('Register', 'Register'), ('Password', 'Password')], default='Register', max_length=8)),
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to='linklink.linklinkuser')),
            ],
        ),
        migrations.CreateModel(
            name='Profile',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('imageUrl', models.CharField(max_length=200)),
                ('introduction', models.TextField()),
                ('website', models.CharField(blank=True, max_length=100)),
                ('gender', models.CharField(choices=[('M', 'Male'), ('F', 'Female'), ('X', 'None')], default='None', max_length=1)),
                ('birthDate', models.DateField()),
                ('createdAt', models.DateTimeField(auto_now_add=True)),
                ('updatedAt', models.DateTimeField(auto_now=True)),
                ('qualityTags', models.ManyToManyField(to='linklink.qualitytag')),
                ('skillTags', models.ManyToManyField(to='linklink.skilltag')),
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to='linklink.linklinkuser')),
            ],
        ),
        migrations.AddField(
            model_name='friendrequest',
            name='getterId',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='getterIdFriendRequest', to='linklink.linklinkuser'),
        ),
        migrations.AddField(
            model_name='friendrequest',
            name='senderId',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='senderIdFriendRequest', to='linklink.linklinkuser'),
        ),
        migrations.CreateModel(
            name='Education',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('school', models.CharField(max_length=50)),
                ('major', models.CharField(max_length=50)),
                ('dateStart', models.DateField()),
                ('dateEnd', models.DateField()),
                ('createdAt', models.DateTimeField(auto_now_add=True)),
                ('updatedAt', models.DateTimeField(auto_now=True)),
                ('profile', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='linklink.profile')),
            ],
        ),
        migrations.CreateModel(
            name='ChatRoom',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('createdAt', models.DateTimeField(auto_now_add=True)),
                ('updatedAt', models.DateTimeField(auto_now=True)),
                ('chatLogs', models.ManyToManyField(to='linklink.chatlog')),
                ('users', models.ManyToManyField(to='linklink.linklinkuser')),
            ],
        ),
        migrations.AddField(
            model_name='chatlog',
            name='getterId',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='getterIdChat', to='linklink.linklinkuser'),
        ),
        migrations.AddField(
            model_name='chatlog',
            name='senderId',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='senderIdChat', to='linklink.linklinkuser'),
        ),
    ]
