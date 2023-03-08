import { SlashCommandBuilder } from "discord.js";
import User from "../models/user.mjs";
import Role from "../models/role.mjs";

export default {
    data: new SlashCommandBuilder()
        .setName("deposito")
        .setDescription("Alguien deposito a la land")
        .addUserOption(option =>
            option.setName('usuario')
                .setDescription('La persona que hizo el deposito')
                .setRequired(true))
        .addNumberOption(option =>
            option.setName('cantidad')
                .setDescription('Cantidad del deposito')
                .setMinValue(1)
                .setRequired(true)),

    execute: async (interaction) => {
        const target = interaction.options.getUser('usuario');
        const quantity = interaction.options.getNumber('cantidad');

        if(target.bot || target.system) {
            await interaction.reply({content: 'Un bot no puede depositar a la land', ephemeral: true});
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
            user = await User.create({
                id: target.id,
                nickname: target.username
            });
        }

        const transaction = await user.createTransaction({
            quantity
        });

        await interaction.reply(`Deposito de ${user.nickname} $${transaction.quantity} registrado en fecha ${transaction.getDate()}`);
    }
}