-- Admin table
CREATE TABLE admins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'admin'
);

-- Products table
CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    img1 VARCHAR(255) DEFAULT 'https://media.istockphoto.com/id/1415203156/vector/error-page-page-not-found-vector-icon-in-line-style-design-isolated-on-white-background.jpg?s=612x612&w=0&k=20&c=RuQ_sn-RjAVNKOmARuSf1oXFkVn3OMKeqO5vw8GYoS8=',
    img2 VARCHAR(255) DEFAULT 'https://media.istockphoto.com/id/1415203156/vector/error-page-page-not-found-vector-icon-in-line-style-design-isolated-on-white-background.jpg?s=612x612&w=0&k=20&c=RuQ_sn-RjAVNKOmARuSf1oXFkVn3OMKeqO5vw8GYoS8=',
    img3 VARCHAR(255) DEFAULT 'https://media.istockphoto.com/id/1415203156/vector/error-page-page-not-found-vector-icon-in-line-style-design-isolated-on-white-background.jpg?s=612x612&w=0&k=20&c=RuQ_sn-RjAVNKOmARuSf1oXFkVn3OMKeqO5vw8GYoS8=',
    name VARCHAR(255) DEFAULT 'Unnamed Product',
    category VARCHAR(255) DEFAULT 'uncategorized',
    price DECIMAL(10, 2) DEFAULT 0.00,
    quantity VARCHAR(255) DEFAULT '0',
    details1 TEXT,
    details2 TEXT,
    details3 TEXT,
    manufacturer VARCHAR(255),
    manufactured_country VARCHAR(255),
    key_points1 TEXT,
    key_points2 TEXT,
    key_points3 TEXT,
    key_points4 TEXT,
    key_points5 TEXT,
    available VARCHAR(50) DEFAULT 'available'
);

-- Cards table
CREATE TABLE cards (
    id INT AUTO_INCREMENT PRIMARY KEY,
    img1 VARCHAR(255) DEFAULT 'https://media.istockphoto.com/id/1415203156/vector/error-page-page-not-found-vector-icon-in-line-style-design-isolated-on-white-background.jpg?s=612x612&w=0&k=20&c=RuQ_sn-RjAVNKOmARuSf1oXFkVn3OMKeqO5vw8GYoS8=',
    name VARCHAR(255) DEFAULT 'Unnamed Card',
    category VARCHAR(255) DEFAULT 'uncategorized',
    details1 TEXT,
    details2 TEXT,
    C_Number VARCHAR(255),
    C_Location VARCHAR(255),
    available VARCHAR(50) DEFAULT 'available',
    Search TEXT,
    reply JSON
);

-- Content Blocks table
CREATE TABLE content_blocks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    img VARCHAR(255),
    heading VARCHAR(255),
    subHeading VARCHAR(255),
    search_Key VARCHAR(255),
    details TEXT,
    productId VARCHAR(255)
);

-- Page Items table
CREATE TABLE page_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    search VARCHAR(255) UNIQUE,
    img1 VARCHAR(255),
    img2 VARCHAR(255),
    img3 VARCHAR(255),
    img4 VARCHAR(255),
    heading VARCHAR(255),
    subHeading VARCHAR(255),
    details TEXT
);

-- Orders table
CREATE TABLE orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    total_amount DECIMAL(10, 2),
    currency VARCHAR(50),
    tran_date DATETIME,
    tran_id VARCHAR(255) UNIQUE,
    shipping_method VARCHAR(255),
    product_name TEXT,
    cus_name VARCHAR(255),
    cus_email VARCHAR(255),
    cus_add1 TEXT,
    cus_add2 TEXT,
    cus_country VARCHAR(255),
    cus_phone VARCHAR(255),
    cus_phone2 VARCHAR(255),
    ship_name VARCHAR(255),
    ship_add1 TEXT,
    ship_add2 TEXT,
    ship_Contract VARCHAR(255),
    Customer_Note TEXT,
    Customer_Attach VARCHAR(255),
    Status VARCHAR(50),
    Order_note TEXT
);
