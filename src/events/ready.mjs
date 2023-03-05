import { Events } from "discord.js";
import User from "../models/user.mjs";
import Transaction from "../models/transaction.mjs";
import Role from "../models/role.mjs";

export default {
    name: Events.ClientReady,
    once: true,
    execute: client => {
        User.hasMany(Transaction, {foreignKey: 'userId'});
        Transaction.belongsTo(User);

        User.sync();
        Transaction.sync();
        Role.sync();
        
        console.log(`Ready! Logged in as ${client.user.tag}`);
    }
}