const db = require("../services/db.service");

class Mincoin{

    constructor({
        type = "default",
        amount,
        user_id,
        to_user = null,
        order_id = null
    }){
        this.type = type;
        this.amount = amount;
        this.user_id = user_id;
        this.to_user = to_user;
        this.order_id = order_id;
    }

    async move(){
        try{
            if(!['transfer', 'purchase', 'expense'].includes(this.type)){
                return { success: false, message: "Invalid request" }
            }

            if(
                (this.type == "transfer" && this.to_user == null) ||
                (this.type != "transfer" && this.order_id == null)
            ) return { success: false, message: "incomplete request" }

            switch(this.type){
                case "transfer":
                    return this.transfer();
                case "purchase":
                    return this.purchase();
                case "expense": 
                    return this.expense();
                default:
                    return {
                        success: false,
                        message: "Unknown Transfer Type!"
                    }
            }
        }catch(err){
            console.log(err);
            return {
                success: false,
                message: "Something went wrong while transfering mincoin"
            }
        }
    }

    async transfer(){
        try{
            const fromUser = await db.user.findOne({
                where: {
                    user_id: this.user_id
                }
            });

            if( fromUser.reseller_balance < 1 || fromUser.reseller_balance < this.amount) return {
                success: false,
                message: "Insufficient Mincoin Balance, Please Purchase and try again"
            }
            
            await db.user.update({
                reseller_balance: Number(fromUser.reseller_balance) - Number(this.amount)
            }, {
                where: {
                    user_id: this.user_id
                }
            });
            
            const toUser = await db.user.findOne({
                where: {
                    user_id: this.to_user
                }
            });

            await db.user.update({
                reseller_balance: Number(toUser.reseller_balance) + Number(this.amount)
            }, {
                where: {
                    user_id: this.to_user
                }
            });
            return this.record();
        }catch(err){
            console.log(err);
            return {
                success: false,
                message: "Something went wrong while transfering mincoin"
            }
        }
    }

    async purchase(){
        try{
            const user = await db.user.findOne({
                where: {
                    user_id: this.user_id
                }
            });
            await db.user.update({
                reseller_balance: Number(user.reseller_balance) + Number(this.amount)
            }, {
                where: {
                    user_id: this.user_id
                }
            });
            return this.record();
        }catch(err){
            console.log(err);
            return {
                success: false,
                message: "Something went wrong while transfering mincoin"
            }
        }
    }

    async expense(){
        try{
            const user = await db.user.findOne({
                where: {
                    user_id: this.user_id
                }
            });
            if(user.reseller_balance < this.amount) return {
                success: false,
                message: "Insufficient Mincoin Balance, Please Purchase and try again"
            }
            await db.user.update({
                reseller_balance: Number(user.reseller_balance) - Number(this.amount)
            }, {
                where: {
                    user_id: this.user_id
                }
            });
            return this.record();
        }catch(err){
            console.log(err);
            return {
                success: false,
                message: "Something went wrong while transfering mincoin"
            }
        }
    }

    async record(){
        try{
            await db.coin_history.create({
                user_id: this.user_id,
                user_to: this.to_user,
                coin_amount: this.amount,
                transaction_type: this.type,
                order_id: this.order_id
            });
            return {
                success: true,
                message: "Transaction successfully saved!"
            }
        }catch(err){
            console.log(err);
            return {
                success: false,
                message: "Something went wrong while saving transaction"
            }
        }
    }
}

module.exports = Mincoin;