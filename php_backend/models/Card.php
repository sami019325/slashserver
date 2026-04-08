<?php
require_once __DIR__ . '/../config/db.php';

class Card {
    private $conn;
    private $table = 'cards';

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
        $query = 'INSERT INTO ' . $this->table . ' (name, category, details1, details2, C_Number, C_Location, available, Search, reply, img1) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param('ssssssssss', $data['name'], $data['category'], $data['details1'], $data['details2'], $data['C_Number'], $data['C_Location'], $data['available'], $data['Search'], $data['reply'], $data['img1']);
        return $stmt->execute();
    }

    public function update($id, $data) {
        $query = 'UPDATE ' . $this->table . ' SET name = ?, category = ?, details1 = ?, details2 = ?, C_Number = ?, C_Location = ?, available = ?, Search = ?, reply = ?, img1 = ? WHERE id = ?';
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param('ssssssssssi', $data['name'], $data['category'], $data['details1'], $data['details2'], $data['C_Number'], $data['C_Location'], $data['available'], $data['Search'], $data['reply'], $data['img1'], $id);
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
