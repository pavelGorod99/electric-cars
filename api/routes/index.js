const express= require("express");
const electricCarsController= require("../controllers/electric-cars.controller");
const manufactureController= require("../controllers/manufacture.controller");
const router= express.Router();

router.route("/electric-cars")
    .get(electricCarsController.getAll)
    .post(electricCarsController.addOne);
    
router.route("/electric-cars/:electricCarId")
    .get(electricCarsController.getOne)
    .delete(electricCarsController.deleteOne)
    .put(electricCarsController.fullUpdateOne)
    .patch(electricCarsController.partialUpdateOne);

router.route("/electric-cars/:electricCarId/manufacture")
    .get(manufactureController.getAll)
    .post(manufactureController.createOne);

router.route("/electric-cars/:electricCarId/manufacture/:manufactureId")
    .get(manufactureController.getOne)
    .delete(manufactureController.deleteOne)
    .put(manufactureController.fullUpdateOne)
    .patch(manufactureController.partiallyUpdateOne);

module.exports = router;