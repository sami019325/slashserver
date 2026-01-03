<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, GET");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

session_start();

require_once __DIR__ . '/../config/db.php';
require_once __DIR__ . '/../models/Admin.php';

$admin = new Admin($conn);

$action = isset($_GET['action']) ? $_GET['action'] : '';

switch ($action) {
    case 'login':
        $data = json_decode(file_get_contents("php://input"), true);
        $adminData = $admin->findByEmail($data['email']);
        if ($adminData && password_verify($data['password'], $adminData['password'])) {
            $_SESSION['user'] = [
                'id' => $adminData['id'],
                'role' => $adminData['role']
            ];
            echo json_encode(['message' => 'Login successful', 'user' => $_SESSION['user']]);
        } else {
            http_response_code(401);
            echo json_encode(['error' => 'Invalid email or password']);
        }
        break;
    case 'logout':
        session_destroy();
        echo json_encode(['message' => 'Logged out']);
        break;
    case 'check-auth':
        if (isset($_SESSION['user']) && $_SESSION['user']['role'] === 'admin') {
            echo json_encode(['message' => 'Authenticated', 'user' => $_SESSION['user']]);
        } else {
            http_response_code(401);
            echo json_encode(['error' => 'Unauthorized']);
        }
        break;
    default:
        http_response_code(400);
        echo json_encode(['error' => 'Invalid action']);
        break;
}
?>
