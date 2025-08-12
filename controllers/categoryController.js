const { Category } = require('../models/Category')

const CategoryController = {
    create: async (req, res) => {
        try {
            const category = {
                name: req.body.name
            };

            const response = await Category.create(category);

            res.status(201).json({
                response,
                msg: "Categoria cadastrada com sucesso"
            })
        } catch (err) {
            console.error(err)
        }
    },
    getAll: async (req, res) => {
        try {
             const category = await Category.find();

             res.json(category);
        } catch (err) {
            console.error(err)
        }
    },
    getAllPaginate: async (req, res) => {
        try {
             
            const page = req.params.page
            const limit = req.params.limit
 

            const categories = await Category.find()
                .skip((page - 1) * limit)
                .limit(parseInt(limit));

            const totalCategories = await Category.countDocuments();
            console.log(totalCategories)
             
            res.json({
                categories,
                totalPages: Math.ceil(totalCategories / limit),
                currentPage: parseInt(page)
            });
        } catch (err) {
            console.error(err)
        }
    },

    get: async (req, res) => {
        try {
            // id => URL
            const id = req.params.id;
            const category = await Category.findById(id);

            if (!category) {
                res.status(404).json({
                    msg: "Categoria não encontrada"
                })
                return;
            }
            res.json(category);
        } catch (err) {
            console.error(err)
        }
    },
    delete: async (req, res) => {
        try {
            // id => URL
            const id = req.params.id;
            const category = await Category.findById(id);

            if (!category) {
                res.status(404).json({
                    msg: "Categoria não encontrada"
                })
                return;
            }
            const deleteCategory = await Category.findByIdAndDelete(id);

            res.status(200).json({
                deleteCategory, msg: "Categoria foi removida com sucesso"
            })
        } catch (err) {
            console.error(err)
        }
    },
    update: async (req, res) => {
        try {
            // id => URL
            const id = req.params.id;
            const category = {
                name: req.body.name
            }

            const updateCategory = await Category.findByIdAndUpdate(id, category);

            if (!updateCategory) {
                res.status(404).json({
                    msg: "Categoria não encontrada"
                })
                return;
            }

            res.status(200).json({ msg: "Categoria atualizada com sucesso", category })
        } catch (err) {
            console.error(err)
        }
    },
}

module.exports = CategoryController