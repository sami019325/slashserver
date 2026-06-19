<?php
require_once __DIR__ . '/../config/db.php';

class Admin {
    private $conn;
    private $table = 'admins';

    public $id;
    public $email;
    public $password;
    public $role;

    public function __construct($db) {
        $this->conn = $db;
    }

    public function findByEmail($email) {
        $query = 'SELECT * FROM ' . $this->table . ' WHERE email = ? LIMIT 1';
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param('s', $email);
        $stmt->execute();
        $result = $stmt->get_result();
        return $result->fetch_assoc();
    }
}
?>
