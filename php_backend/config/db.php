<?php
require_once __DIR__ . '/config.php';

// Create a new MySQLi object
$conn = new mysqli(DB_HOST, DB_USERNAME, DB_PASSWORD, DB_NAME);

// Check for connection errors
if ($conn->connect_error) {
    // Log the error to a file or a logging service
    error_log("Connection failed: " . $conn->connect_error);
    // Send a generic error message to the client
    http_response_code(500);
    echo json_encode(['message' => 'Internal server error']);
    exit();
}

// Set the character set to utf8mb4 for full Unicode support
$conn->set_charset("utf8mb4");
?>
