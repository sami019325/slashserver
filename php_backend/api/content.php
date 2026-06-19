<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

require_once __DIR__ . '/../config/db.php';
require_once __DIR__ . '/../models/ContentBlock.php';
require_once __DIR__ . '/../util/auth.php';

$contentBlock = new ContentBlock($conn);

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        if (isset($_GET['id'])) {
            $contentBlockData = $contentBlock->getById($_GET['id']);
            if ($contentBlockData) {
                echo json_encode($contentBlockData);
            } else {
                http_response_code(404);
                echo json_encode(['message' => 'Content block not found']);
            }
        } else {
            $result = $contentBlock->getAll();
            $contentBlocks = [];
            while ($row = $result->fetch_assoc()) {
                $contentBlocks[] = $row;
            }
            echo json_encode($contentBlocks);
        }
        break;
    case 'POST':
        if (!isAdmin()) {
            http_response_code(401);
            echo json_encode(['error' => 'Unauthorized']);
            break;
        }
        $data = json_decode(file_get_contents("php://input"), true);
        if ($contentBlock->create($data)) {
            http_response_code(201);
            echo json_encode(['message' => 'Content block created']);
        } else {
            http_response_code(503);
            echo json_encode(['message' => 'Unable to create content block']);
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
            if ($contentBlock->update($_GET['id'], $data)) {
                echo json_encode(['message' => 'Content block updated']);
            } else {
                http_response_code(503);
                echo json_encode(['message' => 'Unable to update content block']);
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
            if ($contentBlock->delete($_GET['id'])) {
                echo json_encode(['message' => 'Content block deleted']);
            } else {
                http_response_code(503);
                echo json_encode(['message' => 'Unable to delete content block']);
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
