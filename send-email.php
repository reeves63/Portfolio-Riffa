<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'vendor/autoload.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $fullname = htmlspecialchars($_POST['fullname']);
    $email = htmlspecialchars($_POST['email']);
    $message = htmlspecialchars($_POST['message']);

    $mail = new PHPMailer(true);

    try {
        // Konfigurasi SMTP
        $mail->isSMTP();
        $mail->Host = 'smtp.gmail.com';
        $mail->SMTPAuth = true;
        $mail->Username = 'ripp634@gmail.com'; // Email Anda
        $mail->Password = 'kjzglgsnujktsujt'; // App Password Gmail Anda
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port = 587;

        // Pengaturan email
        $mail->setFrom('ripp634@gmail.com', 'Portfolio Contact Form');
        $mail->addReplyTo($email, $fullname);
        $mail->addAddress('ripp634@gmail.com');
        $mail->Subject = "New Contact Message from $fullname";
        $mail->Body = "You have received a new message from your contact form.\n\n".
                      "Name: $fullname\n".
                      "Email: $email\n\n".
                      "Message:\n$message";

        $mail->send();

        // Kirim respons sukses ke AJAX
        echo "Email berhasil terkirim!";
    } catch (Exception $e) {
        // Kirim respons error ke AJAX
        echo "Gagal mengirim email: {$mail->ErrorInfo}";
    }
} else {
    echo "Invalid request method.";
}
