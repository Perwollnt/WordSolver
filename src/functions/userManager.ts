import * as set from "../settings/settings";
import * as admin from 'firebase-admin';
import { ButtonInteraction, CommandInteraction, MessageActionRow, MessageButton, MessageEmbed } from "discord.js";
import * as msg from '../settings/messages';
export class UserManager {
    constructor() {
    }
    admins: String[] = set.admins;
    async isAdmin(id: String) {
        return this.admins.includes(id);
    }
    async getLang(id: string) {
        const db = admin.firestore();
        const c = (await db.collection('globalUsers').doc(id).get()).data() || "en";
        return c;
    }
    async settings(interaction: CommandInteraction) {
        const messageembed = new MessageEmbed()
        .setTitle("Settings")
        .setDescription("Beállítások/Settings")
        .setColor(`#${msg.helpembedcolor}`)
        .addField("\u200b", `${set.emotes.language} = Change language`, true)

        const row = new MessageActionRow()
        row.addComponents(
            new MessageButton()
                .setCustomId("SettingsChangeLang")
                .setStyle("PRIMARY")
                .setLabel(`${set.emotes.language}`)
        )


        interaction.reply({ embeds: [messageembed], components: [row] });
    }
    async changeLang(interaction: ButtonInteraction) {
        interaction.deferReply();
        const lang = await this.getLang(interaction.user.id);
        let c = "en";
        let cc = "English";
        if(`${lang}` == "hu") {
            c = "en";
            cc = 'English';
        } else {
            c = "hu";
            cc = "Hungarian";
        }
        const db = admin.firestore();
        db.collection('globalUsers').doc(interaction.user.id).set({
            lang: c
        }, { merge: true });
        interaction.editReply({content: `Language changed to ${cc} for user ${interaction.user.username}`});
    }
}