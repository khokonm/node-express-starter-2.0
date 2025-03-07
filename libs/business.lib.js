const db = require('@services/db.service');
const asyncHandler = require('@utils/asyncHandler.util');

class Business {

    constructor(user) {
        this.user = user;
    }

    createBusinessDepartment = (payload) => {
        return new Promise(async (resolve, reject) => {
            try {
                // console.log('inside create business department');
    
                const createDepartment = await db.business_department.create({
                    department_name: payload.name ?? 'Admin',
                    department_color: payload.color ?? '#A020F0',
                    business_id: payload.business_id,
                });
    
                // Check if the result is valid
                if (!createDepartment || !createDepartment.department_id) {
                    return reject(new Error('Failed to create business department or department_id is missing'));
                }
    
                // console.log(`createDepartment` ,createDepartment.dataValues);
                resolve(createDepartment.dataValues);
            } catch (error) {
                console.error('Error creating business department:', error);
                reject(error);
            }
        });
    };

    addBusinessMember = async (payload) => {

        const createBusinessMember = await db.business_member.create({
            business_id: payload.business_id,
            user_id: this.user.user_id,
            department: payload.department_id,
            business_role: payload.business_role ?? 'admin',
        });

        return createBusinessMember.dataValues;
    };
    
    initializeBusiness = async (payload = {}) => {

            const createbusiness = await db.business.create({
                business_name: payload.business_name ?? 'Business Name',
                business_email: payload.business_email ?? null,
                business_phone: payload.business_phone ?? null,
                business_website: payload.business_website ?? null,
                business_photo: payload.business_photo ?? null,
                business_type: payload.business_type ?? null,
                business_size: payload.business_size ?? null,
                business_description: payload.business_description ?? null,
                short_address: payload.short_address ?? null,
            });

            const createBusinessDepartment = await this.createBusinessDepartment({
                business_id: createbusiness.business_id,
            });
            
            // console.log('Created Business Department:', createBusinessDepartment);

            // Check if createBusinessDepartment is valid before proceeding
            if (!createBusinessDepartment || !createBusinessDepartment.department_id) {
            throw new Error('Invalid business department created');
            }

            // return {};
            await this.addBusinessMember({
                business_id: createbusiness.business_id,
                user_id: this.user.user_id,
                department_id: createBusinessDepartment.department_id,
                business_role: 'admin',
            });

            return createbusiness;

    };

    checkAccess = async (business_id, role = 'admin', match = 'exact') => {
        const roleHierarchy = { admin: 3, manager: 2, member: 1 };
    
        const getBusinessMember = await db.business_member.findOne({
            where: {
                business_id,
                user_id: this.user.user_id,
                is_deleted: false,
            }
        });
    
        if (!getBusinessMember) return { error: true, message: "Invalid business selected!" };
    
        const userRoleLevel = roleHierarchy[getBusinessMember.business_role];
        const requiredRoleLevel = roleHierarchy[role];
    
        if (match === 'exact' && getBusinessMember.business_role !== role) {
            return { error: true, message: "You do not have enough permission!" };
        }
    
        if (match === 'tree' && userRoleLevel < requiredRoleLevel) {
            return { error: true, message: "You do not have enough permission!" };
        }
    
        return { error: false };

    };
    

}

module.exports = Business;
