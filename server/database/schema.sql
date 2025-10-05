-- Tạo enum với tên mà Sequelize mong đợi
CREATE TYPE enum_users_role AS ENUM ('user', 'admin'); 

-- Bảng User 
CREATE TABLE users ( 
    user_id SERIAL PRIMARY KEY, 
    username VARCHAR(50) UNIQUE NOT NULL, 
    email VARCHAR(100) UNIQUE NOT NULL, 
    password VARCHAR(255) NOT NULL, 
    full_name VARCHAR(100), 
    phone VARCHAR(15), 
    address TEXT, 
    role enum_users_role DEFAULT 'user', 
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
); 

-- Bảng Category 
CREATE TABLE categories ( 
    category_id SERIAL PRIMARY KEY, 
    name VARCHAR(100) NOT NULL, 
    description TEXT, 
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
); 

-- Bảng Product 
CREATE TABLE products ( 
    product_id SERIAL PRIMARY KEY, 
    category_id INTEGER REFERENCES categories(category_id), 
    name VARCHAR(200) NOT NULL, 
    description TEXT, 
    price DECIMAL(10, 2) NOT NULL, 
    stock_quantity INTEGER DEFAULT 0, 
    image_url VARCHAR(255), 
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
); 

-- Bảng Cart 
CREATE TABLE carts ( 
    cart_id SERIAL PRIMARY KEY, 
    user_id INTEGER REFERENCES users(user_id), 
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
); 

-- Bảng Cart Item để lưu các sản phẩm trong giỏ hàng 
CREATE TABLE cart_items ( 
    cart_item_id SERIAL PRIMARY KEY, 
    cart_id INTEGER REFERENCES carts(cart_id), 
    product_id INTEGER REFERENCES products(product_id), 
    quantity INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
); 

-- Bảng Message để hỗ trợ chức năng chat 
CREATE TABLE messages ( 
    message_id SERIAL PRIMARY KEY, 
    user_id INTEGER REFERENCES users(user_id), 
    admin_id INTEGER REFERENCES users(user_id), 
    content TEXT NOT NULL, 
    is_from_admin BOOLEAN DEFAULT FALSE, 
    is_ai_response BOOLEAN DEFAULT FALSE, 
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
); 

-- Tạo index để tối ưu truy vấn 
CREATE INDEX idx_products_category ON products(category_id); 
CREATE INDEX idx_cart_items_cart ON cart_items(cart_id); 
CREATE INDEX idx_cart_items_product ON cart_items(product_id); 
CREATE INDEX idx_messages_user ON messages(user_id);