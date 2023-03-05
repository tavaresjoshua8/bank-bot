import { SlashCommandBuilder } from "discord.js";
import User from "../models/user.mjs";

export default {
    data: new SlashCommandBuilder()
        .setName("movimientos")
        .setDescription('Consulta los movimientos de un jugador')
        .addUserOption(option =>
            option.setName("usuario")
                .setDescription("La persona que quieres checar sus movimientos")
                .setRequired(false)),

    execute: async (interaction) => {
        const target = interaction.options.getUser('usuario') || interaction.user;

        if (target.bot || target.system) {
            await interaction.reply({ content: 'Un bot no tiene movimientos en la land', ephemeral: true });
            return;
        }

        let user = await User.findByPk(target.id);
        if (!user) {
            await interaction.reply({ content: 'Este usuario no cuenta con ningun movimiento en la land', ephemeral: true });
            return;
        }

        const transactions = await user.getTransactions();
        let message = `Movimientos ${user.nickname}\n`;
        transactions.forEach(transaction => {
            message += `${transaction.getDate()} | $${transaction.quantity} ${transaction.quantity > 0 ? '(Deposito)' : '(Retiro)'}\n`;
        });
        await interaction.reply(message);
    }
}