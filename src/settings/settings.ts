import { MessageEmbed } from "discord.js";
import * as msg from "./messages";


export const admins = ["525705273172819969", "779087642868056083"];

export const emotes = {
    "success": "✅",
    "error": "❌",
    "warning": "⚠",
    "info": "ℹ",
    "question": "❓",
    "loading": "⏳",
    "language": "🌐"
}


export const notAdminEmbed = new MessageEmbed();
    notAdminEmbed.setTitle("ERROR");
    notAdminEmbed.setDescription("You are not an admin");
    notAdminEmbed.setColor("#36393F");

export const settingsembed = new MessageEmbed()
    .setTitle("Settings")
    .setDescription("Here are the current settings")
    .setColor("#36393F")

export async function helpEmbed(lang: String) {
    const messageembed = new MessageEmbed();
    switch (lang) {
        case "en":
            messageembed.setTitle(msg.helpembedtitleen);
            messageembed.setDescription(msg.helpembeddescen);
            messageembed.setColor(`#${msg.helpembedcolor}`);
            messageembed.addField("EN", "/bounty [create|list|solve|mine|claim] ||*You can create, list, solve bounties (and list your bounties or claim them)*||, /solve ||*Solve a bounty*||, /help", true);
            return messageembed;
        case "hu":
            messageembed.setTitle(msg.helpembedtitlehu);
            messageembed.setDescription(msg.helpembeddeschu);
            messageembed.setColor(`#${msg.helpembedcolor}`);
            messageembed.addField("HU", "/bounty [create|list|solve|mine|claim] ||*Szópénz kitűzése, aktív szavak listázása, szavak megoldása*||, /solve ||*Szó kitalálása*||, /help", true);
            return messageembed;
    }
    return null;
}