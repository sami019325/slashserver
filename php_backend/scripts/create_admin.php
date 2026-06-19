<?php
require_once __DIR__ . '/../config/db.php';

if ($argc < 3) {
    echo "Usage: php create_admin.php <email> <password>\n";
    exit(1);
}

$email = $argv[1];
$password = $argv[2];

$hashedPassword = password_hash($password, PASSWORD_BCRYPT);

$query = 'INSERT INTO admins (email, password, role) VALUES (?, ?, ?)';
$stmt = $conn->prepare($query);
$role = 'admin';
$stmt->bind_param('sss', $email, $hashedPassword, $role);

if ($stmt->execute()) {
    echo "Admin user created successfully.\n";
} else {
    echo "Error creating admin user: " . $stmt->error . "\n";
}
?>
