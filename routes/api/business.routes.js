const router = require("express").Router();
const { businessController } = require("@controllers/api");

router.get('/list', businessController.getBusinessList);
router.get('/list-all', businessController.getBusinessListOffPagination);
router.get('/:business_id/departments', businessController.getBusinessDepartments);
router.get('/:business_id/departments-all', businessController.getBusinessDepartmentsOffPagination);
router.get('/business-selected', businessController.getBusinessId);

router.get("/:business_id", businessController.getBusinessById);
router.post('/:business_id/create-department', businessController.createDepartment);
router.post("/create", businessController.CreateBusiness);
router.post("/update", businessController.updateBusiness);
router.post("/add-user", businessController.addUser);
router.post("/add-member", businessController.addBusinessMember);

module.exports = router;