import { SlashCommandBuilder } from "discord.js";
import User from "../models/user.mjs";

export default {
    data: new SlashCommandBuilder()
        .setName("saldo")
        .setDescription('Consulta tu saldo actual')
        .addUserOption(option =>
            option.setName("usuario")
                .setDescription("La persona que quieres checar su saldo")
                .setRequired(false)),

    execute: async (interaction) => {
        const target = interaction.options.getUser('usuario') || interaction.user;

        if (target.bot || target.system) {
            await interaction.reply({ content: 'Un bot no tiene saldo en la land', ephemeral: true });
            return;
        }

        let user = await User.findByPk(target.id);
        if (!user) {
            await interaction.reply({ content: 'Este usuario no cuenta con dinero en la land', ephemeral: true });
            return;
        }

        let transactions = await user.getTransactions();
        const left = transactions.map(transaction => transaction.quantity)
            .reduce((sum, transaction) => sum + transaction);
        await interaction.reply({ content: `${user.nickname} tiene $${left} en la land.` });
    }
}