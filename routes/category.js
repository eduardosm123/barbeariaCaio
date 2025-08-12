// rotas para a categoria

const router = require("express").Router()

const categoryController = require("../controllers/categoryController")

// Funções
router.route("/category").post((req, res) => categoryController.create(req, res))
router.route("/category").get((req, res) => categoryController.getAll(req, res))
router.route("/category/:page&:limit").get((req, res) => categoryController.getAllPaginate(req, res))
router.route("/category/:id").get((req, res) => categoryController.get(req, res));
router.route("/category/:id").delete((req, res) => categoryController.delete(req, res));
router.route("/category/:id").put((req, res) => categoryController.update(req, res));
module.exports = router;