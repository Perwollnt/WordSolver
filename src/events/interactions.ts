import { ButtonInteraction, CommandInteraction, SelectMenuInteraction } from "discord.js";
import * as um from "../functions/userManager";
import * as set from "../settings/settings";
import * as am from "../commands/admin/adminManager";
import * as bm from "../commands/bounty/bountymanager";

const UserManager = new um.UserManager();
const AdminManager = new am.AdminManager();
const BountyManager = new bm.BountyManager();

export class InteractionHandler {
    constructor() {
        
    }
    admins: String[] = set.admins;
    async handleCommandInteractions(interaction: CommandInteraction) {
        switch (interaction.commandName) {
            case "help":
                helpMenu(interaction);
                break;
            case "admin":
                if(!await UserManager.isAdmin(interaction.user.id)) return interaction.reply({ embeds: [set.notAdminEmbed] });
                AdminManager.manageCommands(interaction);
                break;
            case "bounty":
                BountyManager.manageCommands(interaction);
                break;
            case "settings":
                UserManager.settings(interaction);
            default:
                break;
        }
    }
    async handleButtonInteractions(interaction: ButtonInteraction) {
        switch (interaction.customId) {
            case "SettingsChangeLang":
                UserManager.changeLang(interaction);
                break;
            default:
                break;
        }
    }
    async handleMenuInteractions(interaction: SelectMenuInteraction) {
        //empty for now
    }
}

async function helpMenu(interaction: CommandInteraction) {
    let lang = await UserManager.getLang(interaction.user.id);
    if(!lang) lang = "en";
    let embed = await set.helpEmbed(`${lang}`);
    interaction.reply({ embeds: [embed!] });
}