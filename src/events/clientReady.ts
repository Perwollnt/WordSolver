import { Client, TextChannel } from "discord.js";

import * as msg from '../settings/messages';
import { DatabaseManager } from "../functions/dbManager";

const DB = new DatabaseManager();

export class ClientReadyEvent {
    constructor() {

    }
    async console(client: Client) {
        console.log(msg.clientreadymessage.replaceAll("%un", client.user!.username).replaceAll("%mw", await DB.loadDB() + ""));
    }
    async discord(client: Client) {
        (client.guilds.cache.get(process.env.LOGGUILD!)?.channels.cache.get(process.env.LOGCHANNEL!) as TextChannel).send(msg.clientreadymessage.replaceAll("%un", client.user!.username).replaceAll("%mw", DB.normalWords.length + ""));
    }
}