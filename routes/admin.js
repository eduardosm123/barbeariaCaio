const router = require('express').Router();
const {
    getAdmin,
    getAllAdmins,
    createAdmin,
    updateAdmin,
    deleteAdmin
} = require('../controllers/adminController');
const requireAuth = require('../middleware/auth');

// GET /admin/:id - protegido
router.get('/admin/:id', requireAuth, getAdmin);

// GET /admin - protegido
router.get('/admin', requireAuth, getAllAdmins);

// POST /admin - protegido (só admin pode criar outros admins)
router.post('/admin', requireAuth, createAdmin);

// PATCH /admin/:id - protegido
router.patch('/admin/:id', requireAuth, updateAdmin);

// DELETE /admin/:id - protegido
router.delete('/admin/:id', requireAuth, deleteAdmin);

module.exports = router;
