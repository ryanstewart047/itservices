<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $name = $_POST["custom_name"];
    $email = $_POST["custom_email"];
    $phone = $_POST["number"];
    $subject = $_POST["subject"];
    $message = $_POST["msg"];

    // Validate input (you can add more validation as needed)
    if (empty($name) || empty($email) || empty($message)) {
        die("Please fill in all required fields.");
    }

    // Recipient email address
    $to = "official@earpi.org";

    // Email headers
    $headers = "From: $email\r\n";
    $headers .= "Reply-To: $email\r\n";
    $headers .= "Content-Type: text/html; charset=UTF-8\r\n";

    // Email content
    $email_message = "
    <html>
    <body>
        <h2>New Message from Contact Form</h2>
        <p><strong>Name:</strong> $name</p>
        <p><strong>Email:</strong> $email</p>
        <p><strong>Phone:</strong> $phone</p>
        <p><strong>Subject:</strong> $subject</p>
        <p><strong>Message:</strong></p>
        <p>$message</p>
    </body>
    </html>";

    // Send the email
    if (mail($to, $subject, $email_message, $headers)) {
        echo "success";
    } else {
        echo "error";
    }
} else {
    // Redirect back to the form page if accessed directly
    header("Location: your_form_page.html");
    exit();
}
?>
