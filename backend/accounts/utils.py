from django.conf import settings
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from django.contrib.sites.shortcuts import get_current_site
from django.utils.encoding import force_bytes



def send_notification(user, message, subject):
            sender_email = settings.EMAIL_HOST_USER  # Replace with your email address
            sender_password = settings.EMAIL_HOST_PASSWORD  # Replace with your email password
            send_host = settings.EMAIL_HOST
            send_port = settings.EMAIL_PORT
            receiver_email = user.email
            # print("host", send_host, send_port, sender_password)
            

        # Create a multipart message
            msg = MIMEMultipart()
            msg["From"] = "expenseeye24@gmail.com"
            msg["To"] = receiver_email
            msg["Subject"] = subject

            # Create the message as a string
            messages = message

            # Attach the message to the email
            msg.attach(MIMEText(messages, "plain"))

            # Connect to the SMTP server
            server = smtplib.SMTP("smtp.gmail.com", 587)
            server.ehlo()
            server.starttls()

            # Login to the SMTP server
            server.login(sender_email, "gmat vpzx cely ewdm")

            # Send the email
            server.sendmail(sender_email, receiver_email, msg.as_string())

            # Disconnect from the server
            server.quit()
            
