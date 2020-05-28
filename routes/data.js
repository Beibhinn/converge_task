const express = require('express');
const router = express.Router();
const {check, validationResult} = require('express-validator');
const Op = require('sequelize').Op;
const SensorData = require('../models.js').SensorData;

/* PUT data */
router.put('/', [
    check("sensorId").isString().notEmpty(),
    check("time").isInt(),
    check("value").isFloat(),
], async function (req, res) {
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

    return res.status(204).send();
});

/* GET data. */
router.get('/', [
    check("sensorId").isString().notEmpty(),
    check("since").isInt(),
    check("until").isInt(),
], async function (req, res) {
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

module.exports = router;