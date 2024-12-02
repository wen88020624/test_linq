const { sequelize } = require('../../src/config/database');
const productService = require('../../src/services/productService');

describe('ProductService', () => {
    beforeAll(async () => {
        await sequelize.sync({ force: true });
        await productService.seedProducts();
    });

    afterAll(async () => {
        await sequelize.close();
    });

    describe('getAllProducts', () => {
        it('should return all products sorted by price', async () => {
            const products = await productService.getAllProducts();
            expect(products.length).toBeGreaterThan(0);
            expect(products[0].price).toBeLessThan(products[products.length - 1].price);
        });
    });

    describe('searchProducts', () => {
        it('should filter products by minimum price', async () => {
            const products = await productService.searchProducts(10000);
            expect(products.every(p => p.price >= 10000)).toBe(true);
        });

        it('should filter products by category', async () => {
            const products = await productService.searchProducts(null, '電子產品');
            expect(products.length).toBeGreaterThan(0);
            expect(products.every(p => p.stockStatus === 'In Stock' || p.stockStatus === 'Low Stock')).toBe(true);
        });
    });
}); 