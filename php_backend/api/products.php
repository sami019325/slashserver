<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE");
header("Access-Control-Max-Age: 3600");
header("Access-control-allow-headers: content-type, access-control-allow-headers, authorization, x-requested-with");

require_once __DIR__ . '/../config/db.php';
require_once __DIR__ . '/../models/Product.php';
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

$product = new Product($conn);

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        if (isset($_GET['id'])) {
            $productData = $product->getById($_GET['id']);
            if ($productData) {
                echo json_encode($productData);
            } else {
                http_response_code(404);
                echo json_encode(['message' => 'Product not found']);
            }
        } else {
            $result = $product->getAll();
            $products = [];
            while ($row = $result->fetch_assoc()) {
                $products[] = $row;
            }
            echo json_encode($products);
        }
        break;
    case 'POST':
        if (!isAdmin()) {
            http_response_code(401);
            echo json_encode(['error' => 'Unauthorized']);
            break;
        }
        $data = $_POST;
        if (isset($_FILES['img1'])) {
            $imgUrl = uploadImageToImgBB($_FILES['img1']);
            if ($imgUrl) {
                $data['img1'] = $imgUrl;
            }
        }
        if (isset($_FILES['img2'])) {
            $imgUrl = uploadImageToImgBB($_FILES['img2']);
            if ($imgUrl) {
                $data['img2'] = $imgUrl;
            }
        }
        if (isset($_FILES['img3'])) {
            $imgUrl = uploadImageToImgBB($_FILES['img3']);
            if ($imgUrl) {
                $data['img3'] = $imgUrl;
            }
        }
        if ($product->create($data)) {
            http_response_code(201);
            echo json_encode(['message' => 'Product created']);
        } else {
            http_response_code(503);
            echo json_encode(['message' => 'Unable to create product']);
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
            if (isset($_FILES['img1'])) {
                $imgUrl = uploadImageToImgBB($_FILES['img1']);
                if ($imgUrl) {
                    $data['img1'] = $imgUrl;
                }
            }
            if (isset($_FILES['img2'])) {
                $imgUrl = uploadImageToImgBB($_FILES['img2']);
                if ($imgUrl) {
                    $data['img2'] = $imgUrl;
                }
            }
            if (isset($_FILES['img3'])) {
                $imgUrl = uploadImageToImgBB($_FILES['img3']);
                if ($imgUrl) {
                    $data['img3'] = $imgUrl;
                }
            }
            if ($product->update($_GET['id'], $data)) {
                echo json_encode(['message' => 'Product updated']);
            } else {
                http_response_code(503);
                echo json_encode(['message' => 'Unable to update product']);
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
            if ($product->delete($_GET['id'])) {
                echo json_encode(['message' => 'Product deleted']);
            } else {
                http_response_code(503);
                echo json_encode(['message' => 'Unable to delete product']);
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
