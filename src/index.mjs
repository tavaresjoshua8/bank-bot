// Require de discord classes
import { Client, GatewayIntentBits } from "discord.js";
import { config } from "dotenv";
import commandsCollectiom from "./registerCommands.mjs";
import registerEvents from "./registerEvents.mjs";

config();

const { token } = process.env;

// Create a new client instance
const client = new Client({
    intents: [GatewayIntentBits.Guilds]
});
client.commands = commandsCollectiom;

registerEvents(client);

client.login(token);