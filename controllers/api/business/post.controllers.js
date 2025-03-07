const asyncHandler = require('@utils/asyncHandler.util');
const sendResponse = require('@utils/responseHandler.util');
const validate = require("@validations/validate");
const db = require('@services/db.service');
const Business = require('@libs/business.lib');
// const createSchema = require('@validations/business/create.validation');

const { createSchema, updateSchema, addMemberSchema, addUserSchema, addDepartmentSchema } = require('@validations/business');

exports.CreateBusiness = asyncHandler(async (req, res) => {
    const validationError = validate(createSchema, req.fields, res);
    if (validationError) return;

    const { 
        business_name, 
        business_email, 
        business_phone, 
        business_website,  
        business_type,
        business_size,
        short_address,
        business_description,
    } = req.fields;

    const businessService = new Business(req.user);
    const createbusiness = await businessService.initializeBusiness({
        business_name, 
        business_email, 
        business_phone, 
        business_website,  
        business_type,
        business_size,
        short_address,
        business_description,
    });

    return sendResponse(res, 200, 'Business Created Successfully', createbusiness);

});

exports.updateBusiness = asyncHandler(async (req, res) => {
    const validationError = validate(updateSchema, req.fields, res);
    if (validationError) return;
    const { business_name, business_email, business_phone, business_website, business_id } = req.fields;
    const user_id = req.user.user_id;

    const getBusinessMember = await db.business_member.findOne({
        where: {
            business_id,
            user_id,
            is_deleted: false,
        }
    });

    if (!getBusinessMember) return sendResponse(res, 400, 'Invalid Business Selected');

    if (getBusinessMember.business_role != 'admin') return sendResponse(res, 400, 'You don\'t have permission to edit this business');

    await db.business.update({
        business_name,
        business_email,
        business_phone,
        business_website
    }, {
        where: {
            business_id
        }
    });

    return sendResponse(res, 200, 'Business updated Successfully');

});

exports.addUser = asyncHandler( async(req, res) => {
    const validationError = validate(addUserSchema, req.fields, res);
    if (validationError) return;

    const {email, name} = req.fields;

    const checkUser = await db.user.findOne({
        where: {
            email
        }
    });

    if(checkUser) return sendResponse(res, 200, 'User already exist');

    const addUser = await db.user.create({
        email,
        name,
    });

    return sendResponse(res, 200, 'User added Successfully', { user_id: addUser.user_id, name: addUser.name, email: addUser.email });
});

exports.addBusinessMember = asyncHandler(async (req, res) => {

    const validationError = validate(addMemberSchema, req.fields, res);
    if (validationError) return;

    const { member_id, business_id, business_role, department_id } = req.fields;

    const user_id = req.user.user_id;

    const getBusinessMember = await db.business_member.findOne({
        where: {
            business_id,
            user_id,
            is_deleted: false,
        }
    });

    if (!getBusinessMember) return sendResponse(res, 400, 'Invalid Business Selected');

    if (getBusinessMember.business_role != 'admin') return sendResponse(res, 400, 'You don\'t have permission to add member to this business');

    const getDepartment = await db.business_department.findOne({
        where: {
            department_id: department_id
        }
    });

    if (getDepartment.business_id != business_id) return sendResponse(res, 400, 'Invalid Department Selected');

    // check if already added 
    const checkMember = await db.business_member.findOne({
        business_id,
        user_id: member_id,
        is_deleted: false,
    });

    if(checkMember) return sendResponse(res, 400, 'Member already exist!');

    await db.business_member.create({
        business_id,
        user_id: member_id,
        business_role,
        department: department_id
    });

    return sendResponse(res, 200, 'Member added Successfully');

});

exports.createDepartment = asyncHandler( async(req, res) => {
    
    const validationError = validate(addDepartmentSchema, req.fields, res);
    if (validationError) return;

    const { business_id } = req.params;

    const user_id = req.user.user_id;

    const getBusinessMember = await db.business_member.findOne({
        where: {
            business_id,
            user_id,
            is_deleted: false,
        }
    });

    if (!getBusinessMember) return sendResponse(res, 400, 'Invalid Business Selected');

    const { department_name, department_color } = req.fields;

    const createDepartment = await db.business_department.create({
        department_name,
        department_color,
        business_id,
    });

    return sendResponse(res, 200, 'Department created successfully!', { 
        department_id: createDepartment.department_id,
        department_name: createDepartment.department_name,
        department_color: createDepartment.department_color
    });

});