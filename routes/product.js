const router = require("express").Router();
const productController = require("../controllers/productController");

router.route("/product").post((req, res) => productController.create(req, res));
router.route("/product").get((req, res) => productController.getAll(req, res));
router.route("/product/:page&:limit").get((req, res) => productController.getAllPaginate(req, res));
router.route("/product/:id").get((req, res) => productController.get(req, res));
router.route("/product/:id").delete((req, res) => productController.delete(req, res));
router.route("/product/:id").put((req, res) => productController.update(req, res));
module.exports = router;
