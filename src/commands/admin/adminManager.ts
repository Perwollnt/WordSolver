import { CommandInteraction } from "discord.js";
import { appendFile } from 'fs';
import * as admin from 'firebase-admin';

import * as msg from '../../settings/messages';
export class AdminManager {
    constructor() {

    }
    manageCommands(interaction: CommandInteraction) {
        switch (interaction.options.getSubcommand()) {
            case "add":
                this.addword(interaction);
                break;
            case "ban":
                this.banUser(interaction);
                break;
            case "unban":
                this.unBanUser(interaction);
                break;
            case "promote":
                this.promoteUser(interaction);
                break;
            case "demote":
                this.demoteUser(interaction);
                break;
            case "userinfo":
                this.userInfo(interaction);
                break;
            default:
                break;
        }
    }
    async addword(interaction: CommandInteraction) {
        try {
            appendFile("szavak.txt", interaction.options.getString("word") + "\n", async (err) => {
                if(err) interaction.reply(msg.addworderrorr);
                else interaction.reply(msg.addwordsuccess);
            });
        } catch (error) {
            console.error(error);
        }
    }
    async banUser(interaction: CommandInteraction) {
        const db = admin.firestore();
        const user = interaction.options.getUser("user");
        const ref = db.collection("globalUsers").doc(user!.id);
        ref.set({ lastBanDate: Date.now(), isBanned: true, isWordManager: false }, { merge: true });
        interaction.reply("User has been banned");
    }
    async unBanUser(interaction: CommandInteraction) {
        const user = interaction.options.getUser("user");
        const db = admin.firestore();
        const ref = db.collection("globalUsers").doc(user!.id);
        ref.set({ lastUnBanDate: Date.now(), isBanned: false }, { merge: true });
        interaction.reply("User unbanned");
    }
    async clearUser(interaction: CommandInteraction) {
        const user = interaction.options.getUser("user");
        const db = admin.firestore();
        const ref = db.collection("globalUsers").doc(user!.id);
        ref.delete();
        interaction.reply("User cleared");
    }
    async promoteUser(interaction: CommandInteraction) {
        const user = interaction.options.getUser("user");
        const db = admin.firestore();
        const ref = db.collection("globalUsers").doc(user!.id);
        ref.set({ isWordmaster: true }, { merge: true });
        interaction.reply("User promoted");
    }
    async demoteUser(interaction: CommandInteraction) {
        const user = interaction.options.getUser("user");
        const db = admin.firestore();
        const ref = db.collection("globalUsers").doc(user!.id);
        ref.set({ isWordmasterr: false }, { merge: true });
        interaction.reply("User demoted");
    }
    async userInfo(interaction: CommandInteraction) {
        const user = interaction.options.getUser("user");
        const db = admin.firestore();
        const ref = db.collection("globalUsers").doc(user!.id);
        const data = (await ref.get()).data();
        if(!data) interaction.reply("User not found");
        else interaction.reply(`${user!.username}#${user!.discriminator} is ${data.isBanned ? "banned" : "not banned"} and ${data.isWordManager ? "is a wordmaster" : "is not a wordmaster"}, `);
    }
}