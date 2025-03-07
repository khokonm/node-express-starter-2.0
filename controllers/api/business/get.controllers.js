const asyncHandler = require('@utils/asyncHandler.util');
const sendResponse = require('@utils/responseHandler.util');
const paginate = require('@utils/paginate.util');
const db = require('@services/db.service');
const Business = require('@libs/business.lib');

exports.getBusinessId = asyncHandler(async (req, res) => {
    const user_id = req.user.user_id;

    const getBusiness = await db.business_member.findOne({
        where: {
            user_id,
            is_deleted: false,
        },
        include: {
            model: db.business
        },
        raw: true,
        nest: true,
    });

    if (getBusiness) return sendResponse(res, 200, 'Business ID retrieved!', getBusiness.business );

    const businessService = new Business(req.user);
    const createbusiness = await businessService.initializeBusiness();

    return sendResponse(res, 200, 'Business ID retrieved!', createbusiness );
});

exports.getBusinessList = asyncHandler(async (req, res) => {
    const user_id = req.user.user_id;

    const paginationData = await paginate(db.business_member, req.query, {
        where: {
            user_id,
            is_deleted: false,
        },
        include: {
            model: db.business
        }
    });

    return sendResponse(res, 200, 'Business list fetched successfully', paginationData);
});

exports.getBusinessListOffPagination = asyncHandler(async (req, res) => {

    const user_id = req.user.user_id;
    // Fetch all businesses the user is associated with
    const getBusinesses = await db.business_member.findAll({
        where: {
            user_id,
            is_deleted: false,
        },
        include: {
            model: db.business,
        },
        raw: true,
        nest: true,
    });

    // Helper function to format users for a business
    const formatUsersForBusiness = async (businessId) => {
        const businessMembers = await db.business_member.findAll({
            where: {
                business_id: businessId,
                is_deleted: false,
            },
            include: {
                model: db.user,
            },
            raw: true,
            nest: true,
        });

        return businessMembers.map(member => ({
            user_id: member.user.user_id,
            email: member.user.email,
            business_role: member.business_role,
        }));
    };

    // Format businesses and their associated users
    const formatBusinesses = await Promise.all(
        getBusinesses.map(async (businessMember) => {
            const users = await formatUsersForBusiness(businessMember.business_id);

            return {
                business_id: businessMember.business_id,
                business_name: businessMember.business.business_name,
                business_role: businessMember.business_role,
                business_type: businessMember.business.business_type,
                short_address: businessMember.business.short_address,
                business_phone: businessMember.business.business_phone,
                business_website: businessMember.business.business_website,
                users: users,
            };
        })
    );
    
    return sendResponse(res, 200, 'Business list fetched successfully', formatBusinesses);
});

exports.getBusinessDepartments = asyncHandler(async (req, res) => {
    const user_id = req.user.user_id;
    const { business_id } = req.params;

    const paginationData = await paginate(db.business_department, req.query, {
        attributes: ['department_id', 'department_name', 'department_color', 'business_id'],
        where: {
            business_id,
            is_deleted: false,
        }
    });

    return sendResponse(res, 200, 'Business departments fetched successfully', paginationData);
});

exports.getBusinessDepartmentsOffPagination = asyncHandler(async (req, res) => {
    const { business_id } = req.params;

    const paginationData = await db.business_department.findAll({
        attributes: ['department_id', 'department_name', 'department_color', 'business_id'],
        where: {
            business_id,
            is_deleted: false,
        }
    });

    return sendResponse(res, 200, 'Business departments fetched successfully', paginationData);
});

exports.getBusinessById = asyncHandler(async (req, res) => {
    const user_id = req.user.user_id;
    const { business_id } = req.params;

    const getBusiness = await db.business_member.findOne({
        where: {
            business_id,
            user_id,
            is_deleted: false,
        },
        include: {
            model: db.business
        },
        raw: true,
        nest: true
    });

    if(!getBusiness) return sendResponse(res, 400, 'You don\'t have access to this business');

    return sendResponse(res, 200, 'Business fetched successfully', getBusiness);
});