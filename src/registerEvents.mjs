import { fileURLToPath } from "node:url";
import fs from "node:fs";
import path from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(f => f.endsWith('.mjs'));

export default (client) => {
    eventFiles.forEach(async file => {
        const filePath = path.join(eventsPath, file);
        const event = (await import(filePath)).default;

        console.log(`Registering ${event.name}`);
        if (event.once) {
            client.once(event.name, (...args) => event.execute(...args));
        } else {
            client.on(event.name, (...args) => event.execute(...args));
        }
    })
}