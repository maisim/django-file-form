# Generated by Django 3.0.4 on 2020-04-07 13:14

import django.core.files.storage
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('django_file_form', '0004_auto_20170423_0329'),
    ]

    operations = [
        migrations.AlterField(
            model_name='uploadedfile',
            name='uploaded_file',
            field=models.FileField(max_length=255, storage=django.core.files.storage.FileSystemStorage(), upload_to='temp_uploads'),
        ),
    ]
