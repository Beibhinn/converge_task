const express = require('express');
const router = express.Router();
const {check, validationResult} = require('express-validator');
const Op = require('sequelize').Op;
const SensorData = require('../models.js').SensorData;
const Alerts = require('../models.js').Alerts;


/* PUT data */
router.put('/', [
    check("sensorId").isString().notEmpty(),
    check("upperThreshold").isFloat(),
    check("lowerThreshold").isFloat(),
], async function (req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }

    // Create new alerts database entry for a particular sensor ID, or update if one for that ID already exists
    await Alerts.upsert({
        sensorId: req.body.sensorId,
        upperThreshold: req.body.upperThreshold,
        lowerThreshold: req.body.lowerThreshold
    });

    return res.status(204).send();
});


/* GET data. */
router.get('/', [
    check("sensorId").isString().notEmpty()
], async function (req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }

    // find all thresholds for a particular sensor id.
    const results = await Alerts.findOne({
        where: {
            sensorId: req.body.sensorId,
        }
    });
    if (results) {
        return res.json(results);
    }
    return res.status(404).send(`No alerts found for sensor id: ${req.body.sensorId}`);
});

module.exports = router;