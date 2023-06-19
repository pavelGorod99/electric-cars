const mongoose = require("mongoose");
const ElectricCar = mongoose.model(process.env.ELECTRIC_CAR_MODEL);

const _createResponseObject= function() {
    const response= {
        status: process.env.SUCCESS_STATUS_CODE,
        message: {}
    };
    return response;
}

const _setResponse= function(statusCode, message, response) {
    response.status= statusCode;
    response.message= message;
    return response;
}

const _sendResponse= function(res, response) {
    res.status(response.status).json(response.message);
}

const getOne = function (req, res) {
    const electricCarId = req.params.electricCarId;
    const manufactureId = req.params.manufactureId;
    const response= _createResponseObject();

    ElectricCar.findOne(
        {
            _id: electricCarId,
            'manufactures._id': manufactureId
        },
        {
            'manufactures.$': 1
        }
    ).exec()
    .then((electricCar) => response.message= electricCar.manufactures[0])
    .catch((err) => _setResponse(process.env.INTERNAL_SERVER_ERROR_STATUS_CODE, { "err": err }, response))
    .finally(() => _sendResponse(res, response));
}

const getAll = function (req, res) {
    const electricCarId = req.params.electricCarId;
    const response= _createResponseObject();
    ElectricCar.findById(electricCarId)
        .select("manufactures")
        .exec()
        .then((electricCar) => _checkIfElectricCarExists(electricCar, response))
        .then((electricCar) => response.message= electricCar.manufactures)
        .catch((err) => _setResponse(process.env.INTERNAL_SERVER_ERROR_STATUS_CODE, { "err": err }, response))
        .finally(() => _sendResponse(res, response));
}

const _checkIfAnyObjectWasModified= function(responseInfo, response) {
    return new Promise((resolve, reject) => {
        if (responseInfo.modifiedCount == 0) {
            response.status= process.env.OBJECT_NOT_FOUND_STATUS_CODE;
            response.message= process.env.MANUFACTURE_NOT_FOUND_MSG;
            reject(response);
        } else {
            response.message= process.env.MANUFACTURE_DELETED_MSG
            resolve(response);
        }
    })
}

const deleteOne = function (req, res) {
    const electricCarId = req.params.electricCarId;
    const manufactureId = req.params.manufactureId;
    const response= _createResponseObject();

    ElectricCar.updateOne(
        { _id: electricCarId },
        { $pull: { manufactures: { _id: manufactureId } } }
    ).exec()
    .then((responseInfo) => _checkIfAnyObjectWasModified(responseInfo, response))
    .catch((err) => _setResponse(process.env.INTERNAL_SERVER_ERROR_STATUS_CODE, { "err": err }, response))
    .finally(() => _sendResponse(res, response));
}

const _checkIfManufactureExistsAndReturnIt= function(electricCar, manufactureId, response) {
    const updateManufacture = electricCar.manufactures.id(manufactureId);
    if (!updateManufacture) {
        response.status= process.env.OBJECT_NOT_FOUND_STATUS_CODE;
        response.message= process.env.MANUFACTURE_ID_NOT_FOUND_MSG;
    }
    return updateManufacture;
}

const partiallyUpdateOne = function (req, res) {
    const updateManufacture = function (req, electricCar, response) {
        const manufactureId = req.params.manufactureId;
        const updateManufacture = electricCar.manufacture.id(manufactureId);

        if (req.body.country) { updateManufacture.country = req.body.country; }
        if (req.body.state) { updateManufacture.state = req.body.state; }
        if (req.body.city) { updateManufacture.city = req.body.city; }

        _saveElectricCar(electricCar);
    }
    _updateOne(req, res, updateManufacture);
}

const fullUpdateOne = function (req, res) {
    const updateManufacture = function (req, electricCar, response) {
        const manufactureId = req.params.manufactureId;
        const updateManufacture = _checkIfManufactureExistsAndReturnIt(electricCar, manufactureId, response);

        if (updateManufacture != null) {
            updateManufacture.country = req.body.country;
            if (updateManufacture.state) {
                updateManufacture.state = req.body.state;
            }
            updateManufacture.city = req.body.city;
    
            _saveElectricCar(electricCar);
        }
    }
    _updateOne(req, res, updateManufacture);
}


const _updateOne = function (req, res, updateManufactureCallback) {
    const electricCarId = req.params.electricCarId;
    const response= _createResponseObject();

    ElectricCar.findById(electricCarId)
        .exec()
        .then((electricCar) => _checkIfElectricCarExists(electricCar, response))
        .then((electricCar) => updateManufactureCallback(req, electricCar, response))
        .then((electricCar) => {
            
            if (!electricCar) {
                response.status= process.env.OBJECT_NOT_FOUND_STATUS_CODE;
                response.message= process.env.ELECTRIC_CAR_ID_NOT_FOUND_MSG;
            } else {
                updateManufactureCallback(req, electricCar, response);
            }
        }).catch((err) => {
            _setResponse(process.env.INTERNAL_SERVER_ERROR_STATUS_CODE, { "err": err }, response);
        }).finally(() => {
            _sendResponse(res, response);
        })
}

function _saveElectricCar(electricCar) {
    return electricCar.save();
}

const _checkIfElectricCarExists= function(electricCar, response) {
    return new Promise((resolve, reject) => {
        if (electricCar) {
            resolve(electricCar);
        } else {
            response.status= process.env.OBJECT_NOT_FOUND_STATUS_CODE;
            response.message= process.env.ELECTRIC_CAR_ID_NOT_FOUND_MSG;
            reject(response);
        }
    });
}

const _buildNewManufacture= function(body, electricCar) {
    const manufactureArr = electricCar.manufactures;
    let newIndex = manufactureArr.length;
    const newManufacture = {};

    newManufacture.country = body.country;
    if (body.state && body.state != "") {
        newManufacture.state = body.state;
    }
    newManufacture.city = body.city;

    manufactureArr[newIndex] = newManufacture;
    electricCar.manufactures = manufactureArr;
    return new Promise((resolve, reject) => {
        resolve(electricCar);
    });
}

const _buildEachManufacture= function(manufactureArr, electricCar) {
    for (let i= 0; i < manufactureArr.length; i++) {
        _buildNewManufacture(manufactureArr[i], electricCar);
    }
    return new Promise((resolve, reject) => {
        resolve(electricCar);
    });
}

const createMany= function(req, res) {
    const electricCarId= req.params.electricCarId;
    const response= _createResponseObject();
    const manufactureArr= req.body.manufactures;
    ElectricCar.findById(electricCarId)
        .select("manufactures")
        .exec()
        .then((electricCar) => _checkIfElectricCarExists(electricCar))
        .then((electricCar) => _buildEachManufacture(manufactureArr, electricCar))
        .then((electricCar) => _saveElectricCar(electricCar))
        .then(() => _setResponse(process.env.SUCCESS_STATUS_CODE, { message: "Manufactures created successfully!" }, response))
        .catch((err) => _setResponse(process.env.INTERNAL_SERVER_ERROR_STATUS_CODE, { "err": err }, response))
        .finally(() => _sendResponse(res, response));
}

const createOne = function (req, res) {
    const electricCarId = req.params.electricCarId;
    const response= _createResponseObject();

    ElectricCar.findById(electricCarId)
        .select("manufacture")
        .exec()
        .then((electricCar) => _checkIfElectricCarExists(electricCar))
        .then((req, electricCar) => _buildNewManufacture(req.body, electricCar))
        .then((electricCar) => _saveElectricCar(electricCar))
        .catch((err) =>  _setResponse(process.env.INTERNAL_SERVER_ERROR_STATUS_CODE, { "err": err }, response))
        .finally(() => _sendResponse(res, response));
}

module.exports = {
    getAll,
    getOne,
    createOne,
    deleteOne,
    fullUpdateOne,
    partiallyUpdateOne,
    createMany
}