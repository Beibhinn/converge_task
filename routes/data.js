const express = require('express');
const router = express.Router();
const {check, validationResult} = require('express-validator');
const Op = require('sequelize').Op;
const { SensorData, Alerts }= require('../models.js');

/* PUT data */
router.put('/', [
    check("sensorId").isString().notEmpty(),
    check("time").isInt(),
    check("value").isFloat(),
], async function (req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }

    // Don't allow duplicate records - sensor Id & time pairings must be unique
    if (await SensorData.findOne({where: {sensorId: req.body.sensorId, time: req.body.time}})) {
        return res.status(409).send();
    }

    // Create new database entry
    await SensorData.create({sensorId: req.body.sensorId, time: req.body.time, value: req.body.value});

    // Check if there are thresholds associated with the sensor ID
    const alert = await Alerts.findOne({
        where: {
            sensorId: req.body.sensorId,
        }
    });
    // If the sensor ID has associated thresholds, check if the new value exceeds them
    if (alert) {
        if (req.body.value > alert.upperThreshold || req.body.value < alert.lowerThreshold) {
            thresholdCallback(req.body)
        }

    }

    return res.status(204).send();
});

/* GET data. */
router.get('/', [
    check("sensorId").isString().notEmpty(),
    check("since").isInt(),
    check("until").isInt(),
], async function (req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }

    // find all sensor data for a particular id within given time range. Return empty array if no results found
    const results = await SensorData.findAll({
        where: {
            sensorId: req.body.sensorId,
            time: {[Op.between]: [req.body.since, req.body.until]}
        }
    });

    return res.json(results);
});

let thresholdCallback = (sensorData)=>{};

const setThresholdCallback = function(newCallback) {
    thresholdCallback = newCallback;
};

module.exports = { dataRouter: router, setThresholdCallback: setThresholdCallback };