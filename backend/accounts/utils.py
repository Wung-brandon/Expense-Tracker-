from django.conf import settings
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from django.template.loader import render_to_string
from django.utils.html import strip_tags



def send_notification(user, subject, template_path, context):

            """
                Sends an email notification to the user with the specified email template.

                Parameters:
                - user: The user to send the email to.
                - subject: The email subject.
                - template_path: Path to the email template file (e.g., 'emails/password_reset.html').
                - context: The context data for the email template.
             """
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

            # Render the HTML and plain text versions of the email
            html_message = render_to_string(template_path, context)
    
            # Attach the message to the email
            # msg.attach(MIMEText(plain_message, "plain"))
            msg.attach(MIMEText(html_message, "html"))
            

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
            
