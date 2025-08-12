const router = require('express').Router();
const { requireAuth } = require('../middleware/auth');
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

// POST /admin (protegido)
router.post('/admin', requireAuth, createAdmin);

// PATCH /admin/:id (protegido)
router.patch('/admin/:id', requireAuth, updateAdmin);

// DELETE /admin/:id (protegido)
router.delete('/admin/:id', requireAuth, deleteAdmin);

module.exports = router;
