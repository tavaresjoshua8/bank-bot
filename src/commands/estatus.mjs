import User from '../models/user.mjs'
import { SlashCommandBuilder } from "discord.js";

export default {
    data: new SlashCommandBuilder()
        .setName('estatus')
        .setDescription('Ve un estatus del banco'),

    execute: async (interaction) => {
        let saldos = [];

        const users = await User.findAll();
        users.forEach(async (user, index) => {
            let transactions = await user.getTransactions();
            const saldo = transactions.map(transaction => transaction.quantity)
                .reduce((sum, transaction) => sum + transaction);

            saldos[index] = { user: user.nickname, saldo }
        });

        let message = saldos.reduce((msg, item) => msg + `${item.user}: $${item.saldo}\n`);
        interaction.reply({content: message, ephemeral: true});
    }
}