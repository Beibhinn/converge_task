
var express = require('express');
var router = express.Router();
const { check, validationResult } = require('express-validator');

/* PUT data */
router.put('/', [
    check("sensorId").isString().notEmpty(),
    check("time").isInt(),
    check("value").isFloat(),
], function(req, res, next) {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    console.log(req.body);
    return res.status(204);
});

module.exports = router;