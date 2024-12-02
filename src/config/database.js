const { Sequelize } = require('sequelize');

// 創建 Sequelize 實例，使用 SQLite 內存數據庫
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: ':memory:',
    logging: false // 關閉 SQL 查詢日誌
});

// 初始化數據庫連接
const initializeDatabase = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connection established successfully.');
        
        // 同步所有模型
        await sequelize.sync({ force: true }); // force: true 會在每次啟動時重新創建表
        console.log('Database synchronized successfully.');
        
        return sequelize;
    } catch (error) {
        console.error('Unable to connect to the database:', error);
        throw error;
    }
};

module.exports = {
    sequelize,
    initializeDatabase
}; 