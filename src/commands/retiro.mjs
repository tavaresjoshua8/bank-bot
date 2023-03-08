import { SlashCommandBuilder } from "discord.js";
import User from "../models/user.mjs";
import Role from "../models/role.mjs";

export default {
    data: new SlashCommandBuilder()
        .setName("retiro")
        .setDescription("Alguien retiro de la land")
        .addUserOption(option =>
            option.setName('usuario')
                .setDescription('La persona que hizo el retiro')
                .setRequired(true))
        .addNumberOption(option =>
            option.setName('cantidad')
                .setDescription('Cantidad del retiro')
                .setMinValue(1)
                .setRequired(true)),

    execute: async (interaction) => {
        const target = interaction.options.getUser('usuario');
        const quantity = interaction.options.getNumber('cantidad');

        if(target.bot || target.system) {
            await interaction.reply({content: 'Un bot no puede retirar de la land', ephemeral: true});
            return;
        }

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

        let user = await User.findByPk(target.id);
        if(!user) {
            await interaction.reply({content: `${target.username} no cuenta con ningun deposito`, ephemeral: true});
            return;
        }

        const transactions = await user.getTransactions();
        const left = transactions.map(transaction => transaction.quantity)
            .reduce((sum, transaction) => sum + transaction);

        if(quantity > left) {
            await interaction.reply({content: `${user.nickname} no cuenta con saldo suficiente para ese retiro.`, ephemeral: true});
            return;
        }

        const transaction = await user.createTransaction({
            quantity: -quantity
        });
        await interaction.reply(`Retiro de ${user.nickname} $${transaction.quantity*-1} registrado en fecha ${transaction.getDate()}`);
    }
}