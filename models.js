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

const Alerts = sequelize.define('alerts', {
    sensorId: {type: Sequelize.STRING, allowNull: false, unique: true},
    upperThreshold: {type: Sequelize.FLOAT, allowNull: true},
    lowerThreshold: {type: Sequelize.FLOAT, allowNull:true}
});

sequelize.sync({ force: false })
    .then(() => {
        console.log(`Database & tables created!`);
    });

module.exports = { SensorData, Alerts, Sequelize };