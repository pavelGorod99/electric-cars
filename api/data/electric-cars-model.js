const mongoose= require("mongoose");

const manufactureSchema= new mongoose.Schema([
    {
        country: {
            type: String,
            required: true
        },
        state: {
            type: String,
            required: false
        },
        city: {
            type: String,
            required: true,
            unique: true
        }
    }
]);

const exelctricCarSchema= mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    company: {
        type: String,
        required: true
    },
    year: {
        type: Number,
        required: true
    },
    manufacture: {
        type: [manufactureSchema],
        required: false
    }
});

mongoose.model("ElectricCar", exelctricCarSchema, "electricCars");