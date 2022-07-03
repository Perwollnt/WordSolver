// < Imports >
import { config } from "dotenv";
import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";
import { SlashCommandBuilder } from "@discordjs/builders";
//TODO: ADD CLEAR
config();
deploy();

export async function deploy() {
  const commands = [
    new SlashCommandBuilder()
      .setName("solve")
      .setDescription("Tries to find a word you are looking")
      .addStringOption(sc => sc.setName("word").setRequired(true).setDescription("The word you are looking for")),
    new SlashCommandBuilder().setName("help").setDescription("show help embed"),
    new SlashCommandBuilder()
        .setName("settings")
        .setDescription("show settings menu"),
    new SlashCommandBuilder()
      .setName("bounty")
      .setDescription("bounty")
      .addSubcommand((sc) =>
        sc
          .setName("create")
          .setDescription("create a bounty")
          .addStringOption(op =>
            op.setName("word").setDescription("Word you want to be solved").setRequired(true))
          .addIntegerOption(op =>
            op.setName("coins").setDescription("Number of coins you want the solver to get").setRequired(true)))
    .addSubcommand(sc => sc.setName("list").setDescription("list all bounties"))
    .addSubcommand(sc => sc.setName("solve").setDescription("solve a bounty")
          .addStringOption(op => op.setName("word").setDescription("Word you want to solve").setRequired(true))
          .addStringOption(op => op.setName("solvedword").setDescription("the solved word").setRequired(true)))
    .addSubcommand(sc => sc.setName("mine").setDescription("List your bounties"))
    .addSubcommand(sc => sc.setName("claim").setDescription("Claim a bounty")
      .addStringOption(op => op.setName("bountyid").setDescription("The id of the bounty you want to claim").setRequired(true))),
    new SlashCommandBuilder()
        .setName("admin")
        .setDescription("admin commands")
        .setDefaultPermission(true)
        .addSubcommand(sc => sc.setName("add").setDescription("add a word to the database").addStringOption(op => op.setName("word").setDescription("word to add")))
        .addSubcommand(sc => sc.setName("ban").setDescription("ban a user from the bounty system").addUserOption(op => op.setName("user").setDescription("user to ban")))
        .addSubcommand(sc => sc.setName("unban").setDescription("unban a user from the bounty system").addUserOption(op => op.setName("user").setDescription("user to unban")))
        .addSubcommand(sc => sc.setName("promote").setDescription("promote a user to wordMaster").addUserOption(op => op.setName("user").setDescription("user to promote")))
        .addSubcommand(sc => sc.setName("demote").setDescription("demote a user from wordMaster").addUserOption(op => op.setName("user").setDescription("user to demote")))
        .addSubcommand(sc => sc.setName("restart").setDescription("restart the bot"))
        .addSubcommand(sc => sc.setName("userinfo").setDescription("Get user information").addUserOption(op => op.setName("user").setDescription("user to get info about")))
        .addSubcommand(sc => sc.setName("clear").setDescription("User to clear").addUserOption(op => op.setName("user").setDescription("user to clear x2"))),
  ].map((cm => cm.toJSON()));
  (async () => {
    const rest: any = new REST({version: "9"}).setToken(process.env.TOKEN!);
    await rest.put(Routes.applicationCommands("813129984340131850"), {body: commands});
    console.log("Deployed!");
  }) ();
}