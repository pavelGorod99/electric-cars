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
            required: true
        }
    }
]);

// const manufactureSchema= new mongoose.Schema([
//     {
//         country: {
//             type: String,
//             required: true,
//             unique: true
//         },
//         states: {
//             type: [
//                 {
//                     state: {
//                         type: String,
//                         required: true,
//                         unique: true
//                     },
//                     cities: [
//                         {
//                             city: {
//                                 type: String,
//                                 required: true,
//                                 unique: true
//                             }
//                         }
//                     ]
//                 }
//             ],
//             required: false
//         },
//         cities: {
//             type: [
//                 {
//                     city: {
//                         type: String,
//                         required: true,
//                         unique: true
//                     }
//                 }
//             ],
//             required: false
//         }
//     }
// ]);

const electricCarSchema= mongoose.Schema({
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
    manufactures: {
        type: [manufactureSchema],
        required: false
    }
});

mongoose.model("ElectricCar", electricCarSchema, "electricCars");