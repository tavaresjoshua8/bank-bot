import Role from '../models/role.mjs';
import User from '../models/user.mjs';
import { SlashCommandBuilder } from "discord.js";

export default {
    data: new SlashCommandBuilder()
        .setName('estatus')
        .setDescription('Ve un estatus del banco'),

    execute: async (interaction) => {
        const allRoles = await Role.findAll();
        const userRoles = interaction.member.roles.cache;

        let permiso = false;
        allRoles.forEach(role => {
            if(userRoles.get(role.id)) {
                permiso = true;
            }
        });

        if(!permiso) {
            await interaction.reply({content: `No tienes permisos para administrar el banco`, ephemeral: true});
            return;
        }

        let content = '';
        let sum = 0;

        const users = await User.findAll();

        for (const user of users) {
            let transactions = await user.getTransactions();
            const saldo = transactions.map(transaction => transaction.quantity)
                .reduce((sum, transaction) => sum + transaction);

            content += `${user.nickname}: $${saldo}\n`;
            sum += saldo;
        }

        content += '======================\n'
            + `Saldo Land: $${sum}`;

        await interaction.reply({ content, ephemeral: false });
    }
}