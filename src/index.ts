import { config } from "dotenv";
import * as admin from "firebase-admin";
import { ButtonInteraction, Client, CommandInteraction, SelectMenuInteraction } from 'discord.js';
import * as cre from "./events/clientReady";
import * as it from "./events/interactions";
config();
admin.initializeApp();

const ClientReadyEvent = new cre.ClientReadyEvent();
const InteractionHandler = new it.InteractionHandler();

const client = new Client({
    intents: ['GUILDS', 'GUILD_MEMBERS', 'GUILD_MESSAGES', 'GUILD_MESSAGE_REACTIONS', 'GUILD_MESSAGE_TYPING', 'DIRECT_MESSAGES', 'DIRECT_MESSAGE_REACTIONS', 'DIRECT_MESSAGE_TYPING'],
    partials: ['MESSAGE', 'CHANNEL', 'REACTION', 'USER', 'GUILD_MEMBER'],
});
client.on('ready', async () => {
    ClientReadyEvent.console(client);
});

client.on('interactionCreate', (interaction) => {
    if(interaction.isApplicationCommand()) InteractionHandler.handleCommandInteractions(interaction as CommandInteraction);
    if(interaction.isButton()) InteractionHandler.handleButtonInteractions(interaction as ButtonInteraction);
    if(interaction.isSelectMenu()) InteractionHandler.handleMenuInteractions(interaction as SelectMenuInteraction);
});

client.login(process.env.TOKEN); 