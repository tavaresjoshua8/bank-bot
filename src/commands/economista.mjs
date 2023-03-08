import Role from "../models/role.mjs";
import { SlashCommandBuilder } from "discord.js";

export default {
    data: new SlashCommandBuilder()
        .setName('economistas')
        .setDescription('Elige el rol de los economistas')
        .addRoleOption(option =>
            option.setName('role')
            .setDescription('El rol elegido')
            .setRequired(true))
        .addBooleanOption(option =>
            option.setName('delete')
            .setDescription('Eliminar los permisos de este rol')
            .setRequired(false)),

    execute: async (interaction) => {
        const role = interaction.options.getRole('role');
        const del = interaction.options.getBoolean('delete') || false;

        const allRoles = await Role.findAll();
        const userRoles = interaction.member.roles.cache;
        let permiso = true;
        allRoles.forEach(role => {
            console.log(role);
            console.log(userRoles.get(role.id));
            if(userRoles.get(role.id)) {
                permiso = true;
            }
        });

        if(!permiso) {
            await interaction.reply({content: `No tienes permisos para administrar el banco`, ephemeral: true});
            return;
        }

        if(del) {
            const rol = await Role.findByPk(role.id);
            if(!rol) {
                await interaction.reply({content: `El rol seleccionado no contenia permisos en el banco`, ephemeral: true});
                return;
            }
            rol.destroy();
            await interaction.reply(`Se ha eliminado los permisos de ${rol.name}`);
        } else {
            const rol = await Role.create({
                id: role.id,
                name: role.name
            });
            await interaction.reply(`Se han asignado permisos en el banco al rol ${rol.name}`);
        }
    }
}