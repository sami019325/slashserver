<?php
require_once __DIR__ . '/../config/db.php';

class Order {
    private $conn;
    private $table = 'orders';

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
        $query = 'INSERT INTO ' . $this->table . ' (total_amount, currency, tran_date, tran_id, shipping_method, product_name, cus_name, cus_email, cus_add1, cus_add2, cus_country, cus_phone, cus_phone2, ship_name, ship_add1, ship_add2, ship_Contract, Customer_Note, Customer_Attach, Status, Order_note) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param('dssssssssssssssssssss', $data['total_amount'], $data['currency'], $data['tran_date'], $data['tran_id'], $data['shipping_method'], $data['product_name'], $data['cus_name'], $data['cus_email'], $data['cus_add1'], $data['cus_add2'], $data['cus_country'], $data['cus_phone'], $data['cus_phone2'], $data['ship_name'], $data['ship_add1'], $data['ship_add2'], $data['ship_Contract'], $data['Customer_Note'], $data['Customer_Attach'], $data['Status'], $data['Order_note']);
        return $stmt->execute();
    }

    public function update($id, $data) {
        $query = 'UPDATE ' . $this->table . ' SET total_amount = ?, currency = ?, tran_date = ?, tran_id = ?, shipping_method = ?, product_name = ?, cus_name = ?, cus_email = ?, cus_add1 = ?, cus_add2 = ?, cus_country = ?, cus_phone = ?, cus_phone2 = ?, ship_name = ?, ship_add1 = ?, ship_add2 = ?, ship_Contract = ?, Customer_Note = ?, Customer_Attach = ?, Status = ?, Order_note = ? WHERE id = ?';
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param('dssssssssssssssssssssi', $data['total_amount'], $data['currency'], $data['tran_date'], $data['tran_id'], $data['shipping_method'], $data['product_name'], $data['cus_name'], $data['cus_email'], $data['cus_add1'], $data['cus_add2'], $data['cus_country'], $data['cus_phone'], $data['cus_phone2'], $data['ship_name'], $data['ship_add1'], $data['ship_add2'], $data['ship_Contract'], $data['Customer_Note'], $data['Customer_Attach'], $data['Status'], $data['Order_note'], $id);
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
