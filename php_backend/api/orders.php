<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

require_once __DIR__ . '/../config/db.php';
require_once __DIR__ . '/../models/Order.php';
require_once __DIR__ . '/../util/auth.php';

$order = new Order($conn);

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        if (isset($_GET['id'])) {
            $orderData = $order->getById($_GET['id']);
            if ($orderData) {
                echo json_encode($orderData);
            } else {
                http_response_code(404);
                echo json_encode(['message' => 'Order not found']);
            }
        } else {
            $result = $order->getAll();
            $orders = [];
            while ($row = $result->fetch_assoc()) {
                $orders[] = $row;
            }
            echo json_encode($orders);
        }
        break;
    case 'POST':
        $data = json_decode(file_get_contents("php://input"), true);
        if ($order->create($data)) {
            http_response_code(201);
            echo json_encode(['message' => 'Order created']);
        } else {
            http_response_code(503);
            echo json_encode(['message' => 'Unable to create order']);
        }
        break;
    case 'PUT':
        if (!isAdmin()) {
            http_response_code(401);
            echo json_encode(['error' => 'Unauthorized']);
            break;
        }
        if (isset($_GET['id'])) {
            $data = json_decode(file_get_contents("php://input"), true);
            if ($order->update($_GET['id'], $data)) {
                echo json_encode(['message' => 'Order updated']);
            } else {
                http_response_code(503);
                echo json_encode(['message' => 'Unable to update order']);
            }
        } else {
            http_response_code(400);
            echo json_encode(['message' => 'Missing ID']);
        }
        break;
    case 'DELETE':
        if (!isAdmin()) {
            http_response_code(401);
            echo json_encode(['error' => 'Unauthorized']);
            break;
        }
        if (isset($_GET['id'])) {
            if ($order->delete($_GET['id'])) {
                echo json_encode(['message' => 'Order deleted']);
            } else {
                http_response_code(503);
                echo json_encode(['message' => 'Unable to delete order']);
            }
        } else {
            http_response_code(400);
            echo json_encode(['message' => 'Missing ID']);
        }
        break;
    default:
        http_response_code(405);
        echo json_encode(['message' => 'Method not allowed']);
        break;
}
?>
