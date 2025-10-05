# 🐠 Aquarium Shop - Cửa Hàng Thủy Sinh

Ứng dụng web full-stack cho cửa hàng thủy sinh với React + Vite frontend và Node.js + Express backend.

## 🚀 Công nghệ sử dụng

### Frontend (Client)
- **React 18** - Thư viện UI
- **Vite** - Build tool và dev server
- **Tailwind CSS** - Framework CSS
- **Axios** - HTTP client
- **React Router DOM** - Routing
- **Port**: 3005

### Backend (Server)
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **PostgreSQL** - Cơ sở dữ liệu quan hệ
- **Sequelize** - ORM cho PostgreSQL
- **JWT** - JSON Web Tokens cho xác thực
- **bcryptjs** - Mã hóa mật khẩu
- **CORS** - Cross-origin resource sharing
- **Helmet** - Security middleware
- **Morgan** - HTTP request logger
- **Dotenv** - Environment variables
- **Port**: 4005

## ✨ Tính năng chính

### Cho khách hàng
- 🔍 Tìm kiếm và lọc sản phẩm theo danh mục
- 🛒 Giỏ hàng với quản lý số lượng
- 📱 Giao diện responsive, thân thiện với mobile
- 🎨 UI/UX hiện đại với Tailwind CSS
- 🔐 Đăng ký và đăng nhập tài khoản

### Cho quản trị viên
- 📊 Dashboard thống kê tổng quan
- 📦 Quản lý sản phẩm (CRUD)
- 🏷️ Quản lý danh mục sản phẩm
- 📈 Theo dõi tồn kho
- 👥 Quản lý người dùng

## 📁 Cấu trúc thư mục

```
Final-Project-New-Tech/
├── client/                     # Frontend React application
│   ├── src/
│   │   ├── App.jsx            # Main App component
│   │   ├── main.jsx           # Entry point
│   │   ├── index.css          # Global styles with Tailwind
│   │   ├── features/          # Feature-based modules
│   │   │   ├── admin/         # Admin dashboard
│   │   │   │   ├── components/
│   │   │   │   └── pages/
│   │   │   └── user/          # User interface
│   │   │       ├── components/
│   │   │       ├── pages/
│   │   │       └── context/
│   │   └── shared/            # Shared components & services
│   │       ├── components/
│   │       ├── context/
│   │       └── services/
│   ├── .env                   # Frontend environment variables
│   ├── package.json           # Frontend dependencies
│   ├── vite.config.js         # Vite configuration
│   ├── tailwind.config.js     # Tailwind configuration
│   └── postcss.config.js      # PostCSS configuration
├── server/                    # Backend Node.js application
│   ├── controllers/           # Request handlers
│   │   ├── cartController.js
│   │   ├── categoryController.js
│   │   ├── productController.js
│   │   └── userController.js
│   ├── routes/               # API routes
│   │   ├── cartRoutes.js
│   │   ├── categoryRoutes.js
│   │   ├── productRoutes.js
│   │   └── userRoutes.js
│   ├── models/               # Sequelize models
│   │   ├── Cart.js
│   │   ├── CartItem.js
│   │   ├── Category.js
│   │   ├── Product.js
│   │   ├── User.js
│   │   └── index.js
│   ├── middleware/           # Custom middleware
│   │   ├── auth.js
│   │   └── adminAuth.js
│   ├── database/            # Database configuration
│   │   ├── database.js
│   │   └── schema.sql
│   ├── config/              # Sequelize config
│   │   └── config.json
│   ├── .env                 # Backend environment variables
│   ├── server.js            # Main server file
│   └── package.json         # Backend dependencies
└── README.md                # Project documentation
```


## 🛠️ Cài đặt và chạy dự án

### Yêu cầu hệ thống
- Node.js (v18 hoặc cao hơn)
- npm hoặc yarn
- PostgreSQL (v12 hoặc cao hơn)

### 1. Clone repository
```bash
git clone <repository-url>
cd Final-Project-New-Tech
```

### 2. Cài đặt cơ sở dữ liệu
1. Cài đặt PostgreSQL trên hệ thống của bạn
2. Tạo database mới:
   ```sql
   CREATE DATABASE aquarium_shop;
   ```
3. Tạo user (tùy chọn):
   ```sql
   CREATE USER romuncle WITH PASSWORD '1234';
   GRANT ALL PRIVILEGES ON DATABASE aquarium_shop TO romuncle;
   ```

### 3. Cài đặt dependencies

#### Backend
```bash
cd server
npm install
```

#### Frontend
```bash
cd client
npm install
```

### 4. Chạy ứng dụng

#### Chạy Backend (Terminal 1)
```bash
cd server
npm run dev
```
Server sẽ chạy tại: http://localhost:4005

#### Chạy Frontend (Terminal 2)
```bash
cd client
npm run dev
```
Client sẽ chạy tại: http://localhost:3005

## 🔧 Scripts có sẵn

### Frontend (Client)
- `npm run dev` - Chạy development server
- `npm run build` - Build production
- `npm run preview` - Preview production build
- `npm run lint` - Chạy ESLint

### Backend (Server)
- `npm run dev` - Chạy development server với nodemon
- `npm start` - Chạy production server
- `npm test` - Chạy tests

## 🌐 API Endpoints

### Base URL: http://localhost:4005

### Health Check
- `GET /api/health` - Server health status
- `GET /api` - API information

### Authentication
- `POST /api/users/register` - Đăng ký tài khoản mới
- `POST /api/users/login` - Đăng nhập
- `GET /api/users/profile` - Lấy thông tin profile (yêu cầu xác thực)
- `PUT /api/users/profile` - Cập nhật profile (yêu cầu xác thực)

### Products
- `GET /api/products` - Lấy danh sách sản phẩm (có thể lọc theo category, search)
- `GET /api/products/:id` - Lấy thông tin sản phẩm theo ID
- `POST /api/products` - Tạo sản phẩm mới (admin)
- `PUT /api/products/:id` - Cập nhật sản phẩm (admin)
- `DELETE /api/products/:id` - Xóa sản phẩm (admin)

### Categories
- `GET /api/categories` - Lấy danh sách danh mục
- `GET /api/categories/:id` - Lấy thông tin danh mục theo ID
- `POST /api/categories` - Tạo danh mục mới (admin)
- `PUT /api/categories/:id` - Cập nhật danh mục (admin)
- `DELETE /api/categories/:id` - Xóa danh mục (admin)

### Cart
- `GET /api/cart` - Lấy giỏ hàng của user (yêu cầu xác thực)
- `POST /api/cart` - Thêm sản phẩm vào giỏ hàng (yêu cầu xác thực)
- `PUT /api/cart/:id` - Cập nhật số lượng sản phẩm trong giỏ hàng (yêu cầu xác thực)
- `DELETE /api/cart/:id` - Xóa sản phẩm khỏi giỏ hàng (yêu cầu xác thực)
- `DELETE /api/cart` - Xóa toàn bộ giỏ hàng (yêu cầu xác thực)




## 🔐 Environment Variables

### Client (.env)
```env
VITE_API_URL=http://localhost:4005
VITE_PORT=3005
```

### Server (.env)
```env
PORT=4005
NODE_ENV=development
CLIENT_URL=http://localhost:3005

# PostgreSQL Database configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=aquarium_shop
DB_USER=romuncle
DB_PASSWORD=1234

# JWT Secret
JWT_SECRET=shop_fish_1234

# For production (Heroku, Railway, etc.)
# DATABASE_URL=postgresql://username:password@hostname:port/database_name
```

**Lưu ý**: Các bảng cơ sở dữ liệu sẽ được tạo tự động khi bạn khởi động server lần đầu tiên.

## 📊 Database Models

### User Model
- `user_id` (UUID, Primary Key)
- `username` (String, Unique)
- `email` (String, Unique)
- `password` (String, Hashed)
- `first_name` (String)
- `last_name` (String)
- `is_admin` (Boolean, Default: false)
- `is_active` (Boolean, Default: true)
- `created_at` (Date)
- `updated_at` (Date)

### Category Model
- `category_id` (UUID, Primary Key)
- `name` (String, Required)
- `description` (Text)
- `created_at` (Date)
- `updated_at` (Date)

### Product Model
- `product_id` (UUID, Primary Key)
- `name` (String, Required)
- `description` (Text)
- `price` (Decimal, Required)
- `stock_quantity` (Integer, Default: 0)
- `image_url` (String)
- `category_id` (UUID, Foreign Key to Category)
- `created_at` (Date)
- `updated_at` (Date)

### Cart Model
- `cart_id` (UUID, Primary Key)
- `user_id` (UUID, Foreign Key to User)
- `created_at` (Date)
- `updated_at` (Date)

### CartItem Model
- `cart_item_id` (UUID, Primary Key)
- `cart_id` (UUID, Foreign Key to Cart)
- `product_id` (UUID, Foreign Key to Product)
- `quantity` (Integer, Required)
- `created_at` (Date)
- `updated_at` (Date)

### Relationships
- User has one Cart
- Cart has many CartItems
- Category has many Products
- Product belongs to Category
- CartItem belongs to Cart and Product

## 🎨 Styling

Dự án sử dụng Tailwind CSS cho styling với:
- Responsive design cho mobile, tablet, desktop
- Gradient backgrounds và modern UI components
- Custom color scheme với blue/indigo theme
- Hover effects và smooth transitions

## 📱 Responsive Design

- **Mobile First**: Thiết kế ưu tiên mobile
- **Breakpoints**: sm (640px), md (768px), lg (1024px), xl (1280px)
- **Grid System**: CSS Grid và Flexbox
- **Touch Friendly**: Buttons và interactive elements phù hợp với touch

## 🔒 Security Features

- JWT-based authentication
- Password hashing với bcryptjs
- CORS configuration
- Helmet security headers
- Input validation và sanitization
- Admin role-based access control

## 📝 Ghi chú phát triển

1. Frontend chạy trên port 3005
2. Backend chạy trên port 4005
3. CORS đã được cấu hình để cho phép kết nối giữa frontend và backend
4. Hot reload được kích hoạt cho cả frontend và backend
5. Database sync tự động khi khởi động server
6. Tailwind CSS đã được cấu hình và sẵn sàng sử dụng

## 🚀 Triển khai

Để triển khai production:

1. Build frontend: `cd client && npm run build`
2. Cấu hình environment variables cho production
3. Setup PostgreSQL database trên hosting service
4. Deploy backend và frontend lên hosting service (Heroku, Railway, Vercel, etc.)

## 🤝 Đóng góp

1. Fork repository
2. Tạo feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Tạo Pull Request

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

## 📞 Liên hệ

- **Project Link**: [https://github.com/yourusername/Final-Project-New-Tech](https://github.com/yourusername/Final-Project-New-Tech)
- **Email**: your.email@example.com

---

**🐠 Aquarium Shop** - Bringing the beauty of aquatic life to your home!