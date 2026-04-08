<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

require_once __DIR__ . '/../config/db.php';
require_once __DIR__ . '/../models/PageItem.php';
require_once __DIR__ . '/../util/auth.php';

$pageItem = new PageItem($conn);

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        if (isset($_GET['id'])) {
            $pageItemData = $pageItem->getById($_GET['id']);
            if ($pageItemData) {
                echo json_encode($pageItemData);
            } else {
                http_response_code(404);
                echo json_encode(['message' => 'Page item not found']);
            }
        } else {
            $result = $pageItem->getAll();
            $pageItems = [];
            while ($row = $result->fetch_assoc()) {
                $pageItems[] = $row;
            }
            echo json_encode($pageItems);
        }
        break;
    case 'POST':
        if (!isAdmin()) {
            http_response_code(401);
            echo json_encode(['error' => 'Unauthorized']);
            break;
        }
        $data = json_decode(file_get_contents("php://input"), true);
        if ($pageItem->create($data)) {
            http_response_code(201);
            echo json_encode(['message' => 'Page item created']);
        } else {
            http_response_code(503);
            echo json_encode(['message' => 'Unable to create page item']);
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
            if ($pageItem->update($_GET['id'], $data)) {
                echo json_encode(['message' => 'Page item updated']);
            } else {
                http_response_code(503);
                echo json_encode(['message' => 'Unable to update page item']);
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
            if ($pageItem->delete($_GET['id'])) {
                echo json_encode(['message' => 'Page item deleted']);
            } else {
                http_response_code(503);
                echo json_encode(['message' => 'Unable to delete page item']);
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
