import { SlashCommandBuilder } from "discord.js";
import User from "../models/user.mjs";

export default {
    data: new SlashCommandBuilder()
        .setName('transferir')
        .setDescription('Transferir dinero a otra persona dentro de la land')
        .addUserOption(option =>
            option.setName('destino')
                .setDescription('La persona a la que le quieres transferir')
                .setRequired(true))
        .addNumberOption(option =>
            option.setName('cantidad')
                .setDescription('La cantidad que le deseas transferir')
                .setMinValue(1)
                .setRequired(true)),

    execute: async (interaction) => {
        const destino = interaction.options.getUser('destino');
        const quantity = interaction.options.getNumber('cantidad');

        if (destino.bot || destino.system) {
            await interaction.reply({ content: 'Un bot no puede retirar de la land', ephemeral: true });
            return;
        }

        let user = await User.findByPk(interaction.user.id);
        if (!user) {
            await interaction.reply({ content: `Usted no cuenta con ningun deposito`, ephemeral: true });
            return;
        }

        let target = await User.findByPk(destino.id);
        if (!target) {
            target = await User.create({
                id: destino.id,
                nickname: destino.username
            });
        }

        const transactions = await user.getTransactions();
        const left = transactions.map(transaction => transaction.quantity)
            .reduce((sum, transaction) => sum + transaction);

        if (quantity > left) {
            await interaction.reply({ content: `Usted no cuenta con saldo suficiente para esta transaccion.`, ephemeral: true });
            return;
        }

        const retiro = await user.createTransaction({
            quantity: -quantity
        });
        const deposito = await target.createTransaction({
            quantity
        });

        await interaction.reply(`Transaccion de ${user.nickname} a ${target.nickname} por $${deposito.quantity} registrada en fecha ${retiro.getDate()}`);
    }
}