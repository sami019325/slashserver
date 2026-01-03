<?php
require_once __DIR__ . '/../config/db.php';

class PageItem {
    private $conn;
    private $table = 'page_items';

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
        $query = 'INSERT INTO ' . $this->table . ' (search, img1, img2, img3, img4, heading, subHeading, details) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param('ssssssss', $data['search'], $data['img1'], $data['img2'], $data['img3'], $data['img4'], $data['heading'], $data['subHeading'], $data['details']);
        return $stmt->execute();
    }

    public function update($id, $data) {
        $query = 'UPDATE ' . $this->table . ' SET search = ?, img1 = ?, img2 = ?, img3 = ?, img4 = ?, heading = ?, subHeading = ?, details = ? WHERE id = ?';
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param('ssssssssi', $data['search'], $data['img1'], $data['img2'], $data['img3'], $data['img4'], $data['heading'], $data['subHeading'], $data['details'], $id);
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
