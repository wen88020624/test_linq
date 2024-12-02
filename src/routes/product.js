const express = require('express');
const router = express.Router();
const productService = require('../services/productService');

// 獲取所有產品
router.get('/', async (req, res) => {
    try {
        const products = await productService.getAllProducts();
        res.json(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ error: 'Database error' });
    }
});

// 過濾產品價錢
router.get('/filter', async (req, res) => {
    try {
        const { minPrice, maxPrice } = req.query;
        const products = await productService.filterProducts(minPrice, maxPrice);
        res.json(products);
    } catch (error) {
        console.error('Error filtering products:', error);
        res.status(500).json({ error: 'Database error' });
    }
});


// 搜索產品
router.get('/search', async (req, res) => {
    try {
        const { minPrice, category } = req.query;
        const products = await productService.searchProducts(minPrice, category);
        res.json(products);
    } catch (error) {
        console.error('Error searching products:', error);
        res.status(500).json({ error: 'Database error' });
    }
});

module.exports = router; 