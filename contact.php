<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $name = $_POST["name"];
    $email = $_POST["email"];
    $message = $_POST["msg"];
    
    // Email recipient (replace with your email address)
    $to = "official@earpi.org";
    
    // Email subject
    $subject = "New Contact Form Submission";
    
    // Email message
    $message_body = "Name: $name\n";
    $message_body .= "Email: $email\n";
    $message_body .= "Message:\n$message";
    
    // Additional headers
    $headers = "From: $email\r\n";
    $headers .= "Reply-To: $email\r\n";
    
    // Send the email and handle success or error
    if (mail($to, $subject, $message_body, $headers)) {
        echo json_encode(array("status" => "success"));
    } else {
        echo json_encode(array("status" => "error"));
    }
}
?>
