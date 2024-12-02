const express = require('express');
const cors = require('cors');
const { initializeDatabase } = require('./src/config/database');
const corsOptions = require('./src/config/cors');
const productRoutes = require('./src/routes/product');
const productService = require('./src/services/productService');

const app = express();
const port = 3000;

// 中間件設置
app.use(cors(corsOptions));
app.use(express.json());

// 路由設置
app.use('/products', productRoutes);
app.get('/health-check', (req, res) => {
    res.status(200).json({ message: 'Server is running smoothly!' });
});

// 啟動服務器
async function startServer() {
    try {
        // 初始化數據庫
        await initializeDatabase();
        console.log('Database initialized');

        // 等待一下確保表已經創建
        setTimeout(async () => {
            try {
                // 填充測試數據
                await productService.seedProducts();
                console.log('Test data seeded');

                // 啟動服務器
                app.listen(port, '0.0.0.0', () => {
                    console.log(`Server is running on port ${port}`);
                });
            } catch (error) {
                console.error('Error during server startup:', error);
                process.exit(1);
            }
        }, 1000);
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}

startServer();

module.exports = app;