const mongoose= require("mongoose");
const ElectricCar= mongoose.model(process.env.ELECTRIC_CAR_MODEL);
const callbackify= require("util").callbackify;

const createElectricCarWithCallback= callbackify(function(newElectricCar) {
    return ElectricCar.create(newElectricCar);
});

const findElectricCarByIdWithCallback= callbackify(function(electricCarId) {
    return ElectricCar.findById(electricCarId).exec();
});

const saveElectricCarWithCallback= callbackify(function(electricCar) {
    return electricCar.save();
});

const getAllElectricCarsWithCallback= callbackify(function(offset, count) {
    return ElectricCar.find().skip(offset).limit(count).exec();
});

const deleteElectricCarWithCallback= callbackify(function(electricCarId) {
    return ElectricCar.findByIdAndDelete(electricCarId).exec();
});

const getAll= function(req, res) {

    console.log("GET ALL");

    let offset= parseFloat(process.env.DEFAULT_FIND_OFFSET);
    let count= parseFloat(process.env.DEFAULT_FIND_COUNT);
    const maxCount= parseInt(process.env.DEFAULT_FIND_MAX_LIMIT, 10);

    if (req.query && req.query.offset) {
        offset= parseInt(req.query.offset, 10);
    }
    if (req.query && req.query.count) {
        count= parseInt(req.query.count, 10);
    }

    if (isNaN(offset) || isNaN(count)) {
        res.status(400).json({ "message": "QueryString Offset and Count should be numbers" });
        return;
    }

    if (count > maxCount) {
        res.status(400).json({ "message": "Cannot exceed count of " + maxCount });
        return;
    }

    getAllElectricCarsWithCallback(offset, count, function(err, electricCars) {
        if (err) {
            res.status(500).json(err);
        } else {
            res.json(electricCars);
        }
    });
}

const getOne= function(req, res) {
    const electricCarId= req.params.electricCarId;
    findElectricCarByIdWithCallback(electricCarId, function(err, electricCar) {
        const response= {
            status: 200,
            message: electricCar
        };
        if (err) {
            response.status= 500;
            response.message= err;
        } else if (!electricCar) {
            response.status= 400;
            response.message= { "message": "Electric car ID not found" };
        }
        res.status(response.status).json(response.message);
    });
}

const addOne= function(req, res) {

    const newElectricCar= buildElectricCar(req);

    createElectricCarWithCallback(newElectricCar, function(err, electricCar) {
        const response= { status: 201, message: electricCar };
        if (err) {
            response.status= 500;
            response.message= err;
        }
        res.status(response.status).json(response.message);
    });
}

const deleteOne= function(req, res) {
    const electricCarId= req.params.electricCarId;
    deleteElectricCarWithCallback(electricCarId, function(err, deletedElectricCar) {
        const response= {
            status: 204,
            message: deletedElectricCar
        };
        if (err) {
            response.status= 500;
            response.message= err;
        } else if (!deletedElectricCar) {
            response.status= 404;
            response.message= {
                "message": "Electric car ID not found"
            };
        }
        res.status(response.status).json(response.message);
    });
};

const fullUpdateOne= function(req, res) {
    const electricCarUpdate= function(req, res, electricCar, response) {
        electricCar.name= req.body.name;
        electricCar.company= req.body.company;
        electricCar.year= req.body.year;

        if (req.body.manufacture.length > 0) {
            let manufactureArr= req.body.manufacture;
            for (let i = 0; i < manufactureArr.length; i++) {
                electricCar.manufacture[i].country= manufactureArr[i].country;
                if (manufactureArr[i].states != null) {
                    electricCar.manufacture[i].state= manufactureArr[i].state;
                    // let stateArr= manufactureArr[i].states;
                    // for (let j = 0; j < stateArr.length; j++) {
                    //     electricCar.manufacture[i].states[j].state= stateArr[j].state;
                    //     let cityArr = stateArr[j].cities;
                    //     for (let q = 0; q < cityArr.length; q++) {
                    //         electricCar.manufacture[i].states[l].cities[q].city= cityArr[q].city;
                    //     }
                    // }
                } 
                electricCar.manufacture[i].city= manufactureArr[i].city;
                // else {
                //     // electricCar.manufacture[i].city= manufactureArr[i].city;
                //     let cityArr= manufactureArr[i].cities;
                //     for (let j = 0; j < cityArr.length; j++) {
                //         electricCar.manufacture[i].cities[j].city = manufactureArr[i].cities[j].city;
                //     }
                // }
            }
        }
        _saveElectricCar(res, electricCar, response);
    }
    _updateOne(req, res, electricCarUpdate);
}

const partialUpdateOne= function(req, res) {
    const electricCarUpdate= function(req, res, electricCar, response) {
        if (req.body.name) { electricCar.name= req.body.name; }
        if (req.body.company) { electricCar.company= req.body.company; }
        if (req.body.year) { electricCar.year= req.body.year; }
    
        if (req.body.manufacture && req.body.manufacture.length > 0) {
            let manufactureArr= req.body.manufacture;
            for (let i = 0; i < manufactureArr.length; i++) {
                if (manufactureArr[i].country) { electricCar.manufacture[i].country= manufactureArr[i].country; }
                if (manufactureArr[i].states != null) { 
                    electricCar.manufacture[i].state= manufactureArr[i].state; 
                    
                    // let stateArr= manufactureArr[i].states;
                    // for (let j = 0; j < stateArr.length; j++) {
                    //     electricCar.manufacture[i].states[j].state= stateArr[j].state;
                    //     if (stateArr[j].cities != null) {
                    //         let cityArr = stateArr[j].cities;
                    //         for (let q = 0; q < cityArr.length; q++) {
                    //             electricCar.manufacture[i].states[l].cities[q].city= cityArr[q].city;
                    //         }
                    //     }
                    // }

                }
                
                if (manufactureArr[i].city) { electricCar.manufacture[i].city= manufactureArr[i].city; }
                
                // else if (manufactureArr[i].cities) { 
                //     // electricCar.manufacture[i].city= manufactureArr[i].city;
                //     let cityArr= manufactureArr[i].cities;
                //     for (let j = 0; j < cityArr.length; j++) {
                //         electricCar.manufacture[i].cities[j].city = manufactureArr[i].cities[j].city;
                //     }
                // }
            }
        }
        _saveElectricCar(res, electricCar, response);
    }
    _updateOne(req, res, electricCarUpdate);
}

const _saveElectricCar= function(res, electricCar, response) {
    saveElectricCarWithCallback(electricCar, function(err, updatedElectricCar) {
        if (err) {
            response.status= 500;
            response.message= err;
        }
        res.status(response.status).json(response.message);
    });
}

const _updateOne= function(req, res, updateElectricCarCallback) {
    const electricCarId= req.params.electricCarId;

    console.log("Electric car id", electricCarId);
    findElectricCarByIdWithCallback(electricCarId, function(err, electricCar) {
        const response= {
            status: 204,
            message: electricCar
        };
        if (err) {
            response.status= 500;
            response.message= err;
        } else if (!electricCar) {
            response.status= 404;
            response.message= {
                "message": "Electric car ID not found"
            }
        }
        if (response.status !== 204) {
            res.status(response.status).json(response.message);
        } else {
            updateElectricCarCallback(req, res, electricCar, response);
        }
    });
}

const buildElectricCar= function(req) {
    console.log(req.body);
    const electricCar= {
        name: req.body.name,
        company: req.body.company,
        year: req.body.year,
        manufacture: []
    };

    if (req.body.manufacture.length > 0) {
        let manufactureArr= req.body.manufacture;
        for (let i = 0; i < manufactureArr.length; i++) {
            electricCar.manufacture[i] = {};
            electricCar.manufacture[i].country = manufactureArr[i].country;
            if (manufactureArr[i].state != null) {
                // FROM HERE
                // let stateArr= manufactureArr[i].states;
                // console.log("STATES ARRAY");
                // console.log(stateArr);
                // electricCar.manufacture[i].states= []
                // for (let j = 0; j < stateArr.length; j++) {
                //     console.log(stateArr[j].state);
    
                //     electricCar.manufacture[i].states[j]= {};

                //     electricCar.manufacture[i].states[j].state= stateArr[j].state;
                //     let cityArr = stateArr[j].cities;
                //     electricCar.manufacture[i].states[j].cities= []
                //     for (let q = 0; q < cityArr.length; q++) {
                //         electricCar.manufacture[i].states[j].cities[q]= {};
                //         electricCar.manufacture[i].states[j].cities[q].city= cityArr[q].city;
                //     }
                // }
                // TO HERE, ALL ABOVE IS NEW VERSION

                // OLD VERSION
                electricCar.manufacture[i].state = manufactureArr[i].state;
            } 
            // FROM HERE
            // else {
            //     let cityArr= manufactureArr[i].cities;
            //     electricCar.manufacture[i].cities= [];
            //     for (let j = 0; j < cityArr.length; j++) {
            //         electricCar.manufacture[i].cities[j]= {};
            //         electricCar.manufacture[i].cities[j].city = manufactureArr[i].cities[j].city;
            //     }
            // }
            // TO HERE NEW CODE VERION

            // OLD VERSION
            electricCar.manufacture[i].city= manufactureArr[i].city;
        }
    }

    return electricCar;
}

module.exports= {
    getAll,
    getOne,
    addOne,
    deleteOne,
    fullUpdateOne,
    partialUpdateOne
}