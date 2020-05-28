const Sequelize = require("sequelize");

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './database.sqlite'
});

const SensorData = sequelize.define('sensorData', {
    sensorId: Sequelize.STRING,
    time: Sequelize.INTEGER,
    value: Sequelize.FLOAT,
});

sequelize.sync({ force: false })
    .then(() => {
        console.log(`Database & tables created!`);
    });

module.exports = { SensorData, Sequelize };