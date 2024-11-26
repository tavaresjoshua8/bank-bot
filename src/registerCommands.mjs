import { Collection, REST, Routes } from "discord.js";
import { fileURLToPath } from "node:url";
import fs from "node:fs";
import path from "node:path";
import { config } from "dotenv";

config();
const { clientId, token } = process.env;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const commands = [];
const commandsCollection = new Collection();

// Grab all the command files from the commands firectory you created earlier
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(f => f.endsWith('.mjs'));

const searchCommands = async () => {
    for(const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = (await import(filePath)).default;
    
        // Grab the SlashCommandBuilder#toJSON() outpout of each command's data for deployment
        commands.push(command.data.toJSON());
        // Set a new item in the Collection with the key as the command name and the value as the exported value
        commandsCollection.set(command.data.name, command);
    }
}

// Construct and prepare an instance of the REST module
const rest = new REST({ version: '10' }).setToken(token);

// and deploy your commands!
searchCommands().then(async () => {
    try {
        console.log(`Started refreshing ${commands.length} application (/) commands.`);

        // The put method is used to fully refresh all commands in the guild with the current set
        const data = await rest.put(
            Routes.applicationCommands(clientId),
            { body: commands }
        );

        console.log(`Successfully reloaded ${data.length} application (/) commands.`);
    } catch (error) {
        console.error(error);
    }
});

export default commandsCollection;