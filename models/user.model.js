module.exports = (sequelize, types) => {
  
    const User = sequelize.define("user", {

            user_id: {
                type: types.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false,
            },

            name: {
                type: types.STRING,
                allowNull: true,
                defaultValue: null,
            },

            email: {
                type: types.STRING,
                allowNull: false,
            },
            
            password: {
                type: types.TEXT,
                allowNull: true,
                defaultValue: null,
            },

            account_role: {
                type: types.ENUM("admin", "user", "stuff"),
                defaultValue: "user",
            },

            account_status: {
                type: types.ENUM("pending", "active", "inactive", "banned"),
                defaultValue: "active",
            },

            is_deleted: {
                type: types.BOOLEAN,
                defaultValue: false
            }

        },
        {
            indexes: [{ type: "unique", name: "user_email", fields: ["email"] }],
        },
    );

    return User;
};
  