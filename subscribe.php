<?php
// Database configuration
$host = 'localhost';
$username = 'u983375524_EarP_Subscribe';
$password = 'EarPdb@%=23Z';
$database = 'u983375524_subscribers';

// SMTP email configuration
$smtp_server = 'smtp.titan.email'; // Replace with your SMTP server
$smtp_username = 'official@earpi.org'; // Replace with your SMTP username
$smtp_password = '%@20Ea!Bb4@!x'; // Replace with your SMTP password
$smtp_port = 587; // Replace with your SMTP port (usually 587 for TLS)

// Connect to the database
$conn = new mysqli($host, $username, $password, $database);
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Get user input
$name = $_POST['name'];
$email = $_POST['email'];

// Insert data into the subscribers table
$sql = "INSERT INTO subscribers (name, email) VALUES ('$name', '$email')";
if ($conn->query($sql) === TRUE) {
    // Subscription successful
    $response = "Subscription successful!";

// Send a confirmation HTML email to the subscriber
$to = $email;
$subject = 'Subscription Confirmation';

$message = '<html>
    <body>
        <p>Thank you for subscribing to our newsletter. You are now part of our community.</p>
        <p>Follow us on social media:</p>
        <p>
            <a href="https://www.facebook.com/itservicefreetown"><img src="assets/img/facebook-icon.png" alt="Facebook"></a>
            <a href="https://twitter.com/earpsierraleone"><img src="assets/img/twitter-icon.png" alt="Twitter"></a>
            <a href="https://www.instagram.com/earpisierraleone/"><img src="assets/img/instagram-icon.png" alt="Instagram"></a>
        </p>
        <p>Support our cause by making a donation:</p>
        <p><a href="https://earpi.org/donation" style="background-color: #338F7A; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 2px 20px;">Donate Now</a></p>
    </body>
</html>';



    $headers = "MIME-Version: 1.0\r\n";
    $headers .= "Content-type: text/html; charset=UTF-8\r\n";
    $headers .= "From: no-reply@earpi.org\r\n"; // Replace with your email address

    // Send the email
    if (mail($to, $subject, $message, $headers)) {
        // Email sent successfully
        $response .= " Confirmation email sent.";
    } else {
        // Email not sent
        $response .= " Confirmation email could not be sent.";
    }
} else {
    $response = "Error: " . $sql . "<br>" . $conn->error;
}

// Close the database connection
$conn->close();

// Return the response as JSON
echo json_encode(['response' => $response]);
?>
