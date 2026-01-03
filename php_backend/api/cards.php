<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

require_once __DIR__ . '/../config/db.php';
require_once __DIR__ . '/../models/Card.php';
require_once __DIR__ . '/../util/auth.php';
require_once __DIR__ . '/../config/config.php';

function uploadImageToImgBB($file) {
    $imageData = base64_encode(file_get_contents($file['tmp_name']));
    $url = 'https://api.imgbb.com/1/upload';
    $data = http_build_query([
        'key' => IMGBB_API_KEY,
        'image' => $imageData,
    ]);

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    $result = curl_exec($ch);
    curl_close($ch);

    $response = json_decode($result, true);
    if ($response['success']) {
        return $response['data']['url'];
    }
    return null;
}

$card = new Card($conn);
$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        if (isset($_GET['id'])) {
            $cardData = $card->getById($_GET['id']);
            if ($cardData) {
                echo json_encode($cardData);
            } else {
                http_response_code(404);
                echo json_encode(['message' => 'Card not found']);
            }
        } else {
            $result = $card->getAll();
            $cards = [];
            while ($row = $result->fetch_assoc()) {
                $cards[] = $row;
            }
            echo json_encode($cards);
        }
        break;
    case 'POST':
        if (!isAdmin()) {
            http_response_code(401);
            echo json_encode(['error' => 'Unauthorized']);
            break;
        }
        $data = $_POST;
        if (isset($_FILES['image'])) {
            $imgUrl = uploadImageToImgBB($_FILES['image']);
            if ($imgUrl) {
                $data['img1'] = $imgUrl;
            }
        }

        if ($card->create($data)) {
            http_response_code(201);
            echo json_encode(['message' => 'Card created']);
        } else {
            http_response_code(503);
            echo json_encode(['message' => 'Unable to create card']);
        }
        break;
    case 'PUT':
        if (!isAdmin()) {
            http_response_code(401);
            echo json_encode(['error' => 'Unauthorized']);
            break;
        }
        if (isset($_GET['id'])) {
            $data = $_POST;
            if (isset($_FILES['image'])) {
                $imgUrl = uploadImageToImgBB($_FILES['image']);
                if ($imgUrl) {
                    $data['img1'] = $imgUrl;
                }
            }
            if ($card->update($_GET['id'], $data)) {
                echo json_encode(['message' => 'Card updated']);
            } else {
                http_response_code(503);
                echo json_encode(['message' => 'Unable to update card']);
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
            if ($card->delete($_GET['id'])) {
                echo json_encode(['message' => 'Card deleted']);
            } else {
                http_response_code(503);
                echo json_encode(['message' => 'Unable to delete card']);
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
