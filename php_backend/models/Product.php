<?php
require_once __DIR__ . '/../config/db.php';

class Product {
    private $conn;
    private $table = 'products';

    public function __construct($db) {
        $this->conn = $db;
    }

    public function getAll() {
        $query = 'SELECT * FROM ' . $this->table;
        $result = $this->conn->query($query);
        return $result;
    }

    public function getById($id) {
        $query = 'SELECT * FROM ' . $this->table . ' WHERE id = ?';
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param('i', $id);
        $stmt->execute();
        $result = $stmt->get_result();
        return $result->fetch_assoc();
    }

    public function create($data) {
        $query = 'INSERT INTO ' . $this->table . ' (name, category, price, quantity, details1, details2, details3, manufacturer, manufactured_country, key_points1, key_points2, key_points3, key_points4, key_points5, available, img1, img2, img3) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param('ssdsssssssssssssss', $data['name'], $data['category'], $data['price'], $data['quantity'], $data['details1'], $data['details2'], $data['details3'], $data['manufacturer'], $data['manufactured_country'], $data['key_points1'], $data['key_points2'], $data['key_points3'], $data['key_points4'], $data['key_points5'], $data['available'], $data['img1'], $data['img2'], $data['img3']);
        return $stmt->execute();
    }

    public function update($id, $data) {
        $query = 'UPDATE ' . $this->table . ' SET name = ?, category = ?, price = ?, quantity = ?, details1 = ?, details2 = ?, details3 = ?, manufacturer = ?, manufactured_country = ?, key_points1 = ?, key_points2 = ?, key_points3 = ?, key_points4 = ?, key_points5 = ?, available = ?, img1 = ?, img2 = ?, img3 = ? WHERE id = ?';
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param('ssdsssssssssssssssi', $data['name'], $data['category'], $data['price'], $data['quantity'], $data['details1'], $data['details2'], $data['details3'], $data['manufacturer'], $data['manufactured_country'], $data['key_points1'], $data['key_points2'], $data['key_points3'], $data['key_points4'], $data['key_points5'], $data['available'], $data['img1'], $data['img2'], $data['img3'], $id);
        return $stmt->execute();
    }

    public function delete($id) {
        $query = 'DELETE FROM ' . $this->table . ' WHERE id = ?';
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param('i', $id);
        return $stmt->execute();
    }
}
?>
