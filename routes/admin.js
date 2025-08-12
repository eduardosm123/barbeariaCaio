const router = require('express').Router();
const {
    getAdmin,
    getAllAdmins,
    createAdmin,
    updateAdmin,
    deleteAdmin
} = require('../controllers/adminController');

// GET /admin/:id
router.get('/admin/:id', getAdmin);

// GET /admin
router.get('/admin', getAllAdmins);

// POST /admin
router.post('/admin', createAdmin);

// PATCH /admin/:id
router.patch('/admin/:id', updateAdmin);

// DELETE /admin/:id
router.delete('/admin/:id', deleteAdmin);

module.exports = router;
