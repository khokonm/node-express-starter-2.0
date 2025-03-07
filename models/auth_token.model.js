module.exports = (sequelize, types) => {
    const AuthToken = sequelize.define("auth_token", {

        auth_token_id: {
            type: types.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
        },
    
        email: {
            type: types.STRING(256),
            allowNull: true,
        },
        
        phone: {
            type: types.STRING(25),
            allowNull: true,
        },

        auth_token: {
            type: types.STRING(50),
            allowNull: false,
        },

        expiry: {
            type: types.STRING(100),
            allowNull: false,
        },

        is_used: {
            type: types.BOOLEAN,
            defaultValue: false,
        },

        user_ip: {
            type: types.STRING(100),
            allowNull: false,
        },

        otp_type: {
            type: types.ENUM("email", "phone"),
            defaultValue: "email",
        },
        
    });
  
    return AuthToken;
};