const Product = require('../models/Product');
const { Op } = require('sequelize');

class ProductService {
    constructor() {
        this.init();
    }

    async init() {
        const { default: Enumerable } = await import('linq');
        this.Enumerable = Enumerable;
    }

    // 獲取所有產品並進行排序和轉換
    async getAllProducts() {
        const products = await Product.findAll();
        return this.Enumerable.from(products)
            .select(p => ({
                name: p.name,
                price: p.price,
                category: p.category
            }))
            .orderBy(p => p.price)
            .toArray();
    }

    // 根據條件搜索產品
    async searchProducts(minPrice, category) {
        const whereClause = {
            stock: { [Op.gt]: 0 }
        };

        if (minPrice) {
            whereClause.price = { [Op.gte]: Number(minPrice) };
        }

        if (category) {
            whereClause.category = category;
        }

        const products = await Product.findAll({ where: whereClause });
        
        return this.Enumerable.from(products)
            .select(p => ({
                id: p.id,
                name: p.name,
                price: p.price,
                stockStatus: p.stock > 10 ? 'In Stock' : 'Low Stock'
            }))
            .orderBy(p => p.price)
            .thenBy(p => p.name)
            .toArray();
    }

    // 初始化測試數據
    async seedProducts() {
        try {
            const products = await Product.bulkCreate([
                { name: "筆記本電腦", price: 30000, category: "電子產品", stock: 15 },
                { name: "智能手機", price: 15000, category: "電子產品", stock: 25 },
                { name: "無線耳機", price: 3000, category: "配件", stock: 50 },
                { name: "機械鍵盤", price: 2500, category: "配件", stock: 30 },
                { name: "滑鼠", price: 800, category: "配件", stock: 45 }
            ]);
            console.log('Test data seeded successfully');
            return products;
        } catch (error) {
            console.error('Error seeding test data:', error);
            throw error;
        }
    }
}

module.exports = new ProductService(); 