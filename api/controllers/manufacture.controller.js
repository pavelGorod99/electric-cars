const mongoose = require("mongoose");
const ElectricCar = mongoose.model(process.env.ELECTRIC_CAR_MODEL);

const callbackify = require("util").callbackify;

const getElectricCarByIdWithCallback = callbackify(function (electricCarId) {
    return ElectricCar.findById(electricCarId).exec();
});

const getAllManufacturesForElectricCarWithCallback = callbackify(function (electricCarId) {
    return ElectricCar.findById(electricCarId).select("manufacture").exec();
});

const saveElectricCarWithCallback = callbackify(function (electricCar) {
    return electricCar.save();
});

const getOneManufacturerByIdWithCallback = callbackify(function (electricCarId, manufactureId) {
    return ElectricCar.findOne(
        {
            _id: electricCarId,
            'manufacture._id': manufactureId
        },
        {
            'manufacture.$': 1
        }
    );
});

const deleteManufactureByIdWithCallback = callbackify(function (electricCarId, manufactureId) {
    return ElectricCar.updateOne(
        { _id: electricCarId },
        { $pull: { manufacture: { _id: manufactureId } } }
    );
});

const _checkIfThereIsInternalServerError = function (err, message, successStatusCode) {
    const response = {
        status: successStatusCode,
        message: { message }
    }
    if (err) {
        response.status = process.env.INTERNAL_SERVER_ERROR_STATUS_CODE;
        response.message = { "err": err };
    }
    return response;
}

const _checkResultForError = function (err, result, successStatusCode, notFoundMessage) {

    const response = _checkIfThereIsInternalServerError(err, result, successStatusCode);

    if (response.status !== process.env.INTERNAL_SERVER_ERROR_STATUS_CODE && !result) {
        response.status = process.env.OBJECT_NOT_FOUND_STATUS_CODE;
        response.message = {
            "message": notFoundMessage
        }
    }
    return response;
}



const _createResponseObject= function() {
    const response= {
        status: process.env.SUCCESS_STATUS_CODE,
        message: {}
    };
    return response;
}

const _setErrResponse= function(err, response, statusCode) {
    if (err) {
        response.status= statusCode;
        response.message= {"err": err};
    }
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
            'manufacture._id': manufactureId
        },
        {
            'manufacture.$': 1
        }
    ).exec()
    .then((electricCar) => {
        response.message= electricCar.manufacture[0];
    }).catch((err) => {
        _setErrResponse(err, response, process.env.INTERNAL_SERVER_ERROR_STATUS_CODE);
    }).finally(() => {
        _sendResponse(res, response);
    });
}

const getAll = function (req, res) {
    const electricCarId = req.params.electricCarId;
    const response= _createResponseObject();
    ElectricCar.findById(electricCarId)
        .select("manufacture")
        .exec()
        .then((electricCar) => {

            if (!electricCar) {
                response.status= process.env.OBJECT_NOT_FOUND_STATUS_CODE;
                response.message= process.env.ELECTRIC_CAR_ID_NOT_FOUND_MSG;
            }

            response.message= electricCar.manufacture
        }).catch((err) => {
            _setErrResponse(err, response, process.env.INTERNAL_SERVER_ERROR_STATUS_CODE);
        }).finally(() => {
            _sendResponse(res, response);
        });
}

const deleteOne = function (req, res) {
    const electricCarId = req.params.electricCarId;
    const manufactureId = req.params.manufactureId;
    const response= _createResponseObject();

    ElectricCar.updateOne(
        { _id: electricCarId },
        { $pull: { manufacture: { _id: manufactureId } } }
    ).exec()
    .then((responseInfo) => {

        if (responseInfo.modifiedCount == 0) {
            response.status= process.env.OBJECT_NOT_FOUND_STATUS_CODE;
            response.message= process.env.MANUFACTURE_NOT_FOUND_MSG;
        } else {
            response.status= process.env.NO_CONTENT_STATUS_CODE;
            response.message= process.env.MANUFACTURE_DELETED_MSG;
        }
    }).catch((err) => {
        _setErrResponse(err, response, process.env.INTERNAL_SERVER_ERROR_STATUS_CODE);
    }).finally(() => {
        _sendResponse(res, response);
    });
}

const _checkIfManufactureExistsAndReturnIt= function(res, electricCar, manufactureId, response) {
    const updateManufacture = electricCar.manufacture.id(manufactureId);
    if (!updateManufacture) {
        response.status= process.env.OBJECT_NOT_FOUND_STATUS_CODE;
        response.message= process.env.MANUFACTURE_ID_NOT_FOUND_MSG;
    }
    return updateManufacture;
}

const partiallyUpdateOne = function (req, res) {
    const updateManufacture = function (req, res, electricCar, response) {
        const manufactureId = req.params.manufactureId;
        const updateManufacture = electricCar.manufacture.id(manufactureId);

        if (req.body.country) { updateManufacture.country = req.body.country; }
        if (req.body.state) { updateManufacture.state = req.body.state; }
        if (req.body.city) { updateManufacture.city = req.body.city; }

        _saveElectricCar(res, electricCar, response);
    }
    _updateOne(req, res, updateManufacture);
}

const fullUpdateOne = function (req, res) {
    const updateManufacture = function (req, res, electricCar, response) {
        const manufactureId = req.params.manufactureId;
        const updateManufacture = _checkIfManufactureExistsAndReturnIt(res, electricCar, manufactureId, response);

        if (updateManufacture != null) {
            updateManufacture.country = req.body.country;
            if (updateManufacture.state) {
                updateManufacture.state = req.body.state;
            }
            updateManufacture.city = req.body.city;
    
            _saveElectricCar(electricCar, response);
        }
    }
    _updateOne(req, res, updateManufacture);
}


const _updateOne = function (req, res, updateManufactureCallback) {
    const electricCarId = req.params.electricCarId;
    const response= _createResponseObject();

    ElectricCar.findById(electricCarId)
        .exec()
        .then((electricCar) => {
            
            if (!electricCar) {
                response.status= process.env.OBJECT_NOT_FOUND_STATUS_CODE;
                response.message= process.env.ELECTRIC_CAR_ID_NOT_FOUND_MSG;
            } else {
                updateManufactureCallback(req, res, electricCar, response);
            }
        }).catch((err) => {
            _setErrResponse(err, response, process.env.INTERNAL_SERVER_ERROR_STATUS_CODE);
        }).finally(() => {
            _sendResponse(res, response);
        })
}

function _saveElectricCar(electricCar, response) {

    return electricCar.save();
        // .then((responseInfo) => {
        //     console.log(responseInfo);
        //     response.message= process.env.ELECTRIC_CAR_UPDATED_SUCCESSFULLY_MSG;
        // }).catch((err) => {
        //     _setErrResponse(err, response, process.env.INTERNAL_SERVER_ERROR_STATUS_CODE);
        // });
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

const _buildNewManufacture= function(req, electricCar) {
    const manufactureArr = electricCar.manufacture;
    let newIndex = manufactureArr.length;
    const newManufacture = {};

    newManufacture.country = req.body.country;
    if (req.body.state) {
        newManufacture.state = req.body.state;
    }
    newManufacture.city = req.body.city;

    manufactureArr[newIndex] = newManufacture;
    electricCar.manufacture = manufactureArr;
}

const createOne = function (req, res) {
    const electricCarId = req.params.electricCarId;
    const response= _createResponseObject();

    ElectricCar.findById(electricCarId)
        .select("manufacture")
        .exec()
        .then((electricCar) => _checkIfElectricCarExists(electricCar))
        .then((req, electricCar) => {
            _buildNewManufacture(req, electricCar);
            _saveElectricCar(electricCar, response);
        })
        .catch((err) => {
            _setErrResponse(err, response, process.env.INTERNAL_SERVER_ERROR_STATUS_CODE);
        }).finally(() => {
            _sendResponse(res, response);
        });

        // .then((electricCar) => {
        //     if (!electricCar) {
        //         response.status= process.env.OBJECT_NOT_FOUND_STATUS_CODE;
        //         response.message= process.env.ELECTRIC_CAR_ID_NOT_FOUND_MSG;
        //     } else {
                
        //     }
        // })
}

module.exports = {
    getAll,
    getOne,
    createOne,
    deleteOne,
    fullUpdateOne,
    partiallyUpdateOne
}