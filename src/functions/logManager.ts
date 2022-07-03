import { Client, TextChannel } from "discord.js";

export class Logger {
    constructor() {

    }
    async log(message: String) {
        console.log(message);
    }
    async discordLog(message: String, client: Client) {
        (client.guilds.cache.get(process.env.LOGGUILD!)?.channels.cache.get(process.env.LOGCHANNEL!) as TextChannel).send(`${message}`);
    }
}