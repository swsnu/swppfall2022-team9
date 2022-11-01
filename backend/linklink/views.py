from django.core.mail import send_mail
from django.conf import settings
import json
from django.http import HttpResponse, HttpResponseNotAllowed
from django.template.loader import render_to_string

def send_register_email(request, recipient, title, message):
    subject = title
    email_from = settings.EMAIL_HOST_USER
    recipient_list = [recipient]
    context = {
        "subject": subject,
        "message": message,
        "button_link": "https://www.google.com",
    }
    html_mail = render_to_string("linklink/register_email.html", context)
    send_mail(
            subject, message, email_from, recipient_list, html_message=html_mail
        )
    # send_mail(subject, message, email_from, recipient_list)
    #  return redirect('redirect to a new page')
    return True


def email_test(request):
    if request.method == "GET":
        send_register_email(request, 'hunkim98@gmail.com', '이메일 인증' ,'회원가입을 하려면 이메일 인증을 진행해주세요')
        return HttpResponse(status=201)

    else:
        return HttpResponseNotAllowed(["POST"])
