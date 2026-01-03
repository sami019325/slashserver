<?php
require_once __DIR__ . '/../config/db.php';

class ContentBlock {
    private $conn;
    private $table = 'content_blocks';

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
        $query = 'INSERT INTO ' . $this->table . ' (img, heading, subHeading, search_Key, details, productId) VALUES (?, ?, ?, ?, ?, ?)';
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param('ssssss', $data['img'], $data['heading'], $data['subHeading'], $data['search_Key'], $data['details'], $data['productId']);
        return $stmt->execute();
    }

    public function update($id, $data) {
        $query = 'UPDATE ' . $this->table . ' SET img = ?, heading = ?, subHeading = ?, search_Key = ?, details = ?, productId = ? WHERE id = ?';
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param('ssssssi', $data['img'], $data['heading'], $data['subHeading'], $data['search_Key'], $data['details'], $data['productId'], $id);
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
