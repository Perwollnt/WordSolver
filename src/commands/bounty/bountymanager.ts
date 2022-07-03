import { CommandInteraction, MessageEmbed } from "discord.js";
import * as admin from "firebase-admin";
import * as msg from "../../settings/messages";
export class BountyManager {
    constructor() {

    }

    words: String[] = [];
    solveContainer: String = ""

    manageCommands(interaction: CommandInteraction) {
        switch (interaction.options.getSubcommand()) {
            case "list":
                this.list(interaction);
                break;
            case "create":
                this.create(interaction); 
                break;
            case "solve":
                this.solve(interaction);
                break;
            case "mine":
                this.mine(interaction);
                break;
            case "claim":
                this.claim(interaction);
            default:
                break;
        }
    }
    async list(interaction: CommandInteraction) {
        const db = admin.firestore();
        await db.collection("WordSolver").doc("BountyList").get().then(doc => {
            this.words = doc.data()!.words;
        });
        const messageembed = new MessageEmbed()
        .setTitle("Bounty words")
        .setColor("#0099ff")
        .setDescription("word \n user who posted it => coins u'll get for the correct answer");
        for(let e of this.words) {
            messageembed.addField(e.split(":")[0], `[${interaction.guild?.members.cache.get(e.split(":")[1])?.displayName}](https://discord.com/users/${e.split(":")[1]}) => ${e.split(":")[2]}`);
        }
        interaction.reply({ embeds: [messageembed] });
    }
    async create(interaction: CommandInteraction) {
        const db = admin.firestore();
        const word = interaction.options.getString("word");
        const coins = interaction.options.getInteger("coins");
        const exist = (await db.collection("WordSolver").doc(interaction.user.id).get()).data()!.coins;
        if(!exist) {
            db.collection("WordSolver").doc(interaction.user.id).set({
                coins: process.env.DEFAULTCOINS
            }, { merge: true });
        }
        if(coins! > exist) {
            interaction.reply(`You dont have enough coins (${coins} < ${exist})`);
            return;
        } else {
            db.collection("WordSolver").doc(interaction.user.id).set({
                coins: (exist - coins!)
            }, { merge: true });
        }
        const c = (await db.collection("WordSolver").doc("BountyList").get()).data()!.words;
        c.push(word+":"+interaction.user.id+":"+coins);
        db.collection("WordSolver").doc("BountyList").set({
            words: c
        }, { merge: true });
        interaction.reply(`You created a bounty word ${word} with ${coins} coins`);
    }
    async solve(interaction: CommandInteraction) {
        const db = admin.firestore();
        const wordToBeSolved = interaction.options.getString("word");
        const possibleSolution = interaction.options.getString("solvedword");
        
        await db.collection("WordSolver").doc("BountyList").get().then(async doc => {
            for(let e of doc.data()!.words) {
                const word = e.split(":")[0];
                if(wordToBeSolved?.match(word)) {
                    console.log(e);
                    this.solveContainer = e;
                    break;
                }
            }
            if(this.solveContainer.length == 0) return;
            const messageembed = new MessageEmbed()
            .setTitle("Bounty words")
            .setColor("#0099ff")
            .addField(
                `If the user marks your answer as \`good\` You will get ${this.solveContainer.split(":")[2]} coins`,
                `You are trying to solve the word ${wordToBeSolved} by [${interaction.guild?.members.cache.get(this.solveContainer.split(":")[1])?.displayName}](https://discord.com/users/${this.solveContainer.split(":")[1]})`, false)
            .addField("\u200B", `(the user cant deny your answer (to prevent abuse of this command) so if you send a wrong answer on purpose an admin will step in and ban you, if the user does not accept the word in **${process.env.DAYS}** days an admin will step in and mark your answer as true)`, false)
            interaction.reply({ embeds: [messageembed] });
            const c = (await db.collection("WordSolver").doc(interaction.user.id).get()).data()!.solved;
            c.push(wordToBeSolved+":"+possibleSolution+":"+interaction.user.id+":"+Date.now()+":"+this.solveContainer.split(":")[2]);
            db.collection("WordSolver").doc(interaction.user.id).set({
                solved: c
            }, { merge: true });
            this.solveContainer = "";
        });
    }
    async mine(interaction: CommandInteraction) {
        const db = admin.firestore();
        await db.collection("WordSolver").doc(interaction.user.id).get().then(doc => {
            const messageembed = new MessageEmbed()
            .setTitle("Bounty words")
            .setColor("#0099ff")
            .setDescription(`You have **${doc.data()!.solved.length}** pending solutions`);
            let i = 0;
            for(let e of doc.data()!.solved) {
                messageembed.addField(`(${i}) ${e.split(":")[0]}: ${e.split(":")[1]}`,`Time: ${e.split(":")[2]} \nSolved by: ${e.split(":")[3]} for ${e.split(":")[4]} coins`, true)
                i++;
            }
            interaction.reply({ embeds: [messageembed] });
        });
    }
    async claim(interaction: CommandInteraction) {
            await interaction.deferReply();
            const db = admin.firestore();
            const id = interaction.options.getString("bountyid");
    
            const bounty = (await db.collection("WordSolver").doc(interaction.user.id).get()).data()!.solved;
            const cc = bounty[id!].split(":");
            const original = cc[0];
            const solved = cc[1];
            //const time = cc[3];
            const solverid = cc[2];
            const coins = cc[4];

            const bountylist = (await db.collection("WordSolver").doc("BountyList").get()).data()!.words;
            const minelist = (await db.collection("WordSolver").doc(interaction.user.id).get()).data()!.solved;
            let isUserWord = false;
            for (let e in minelist) {
                if (minelist[e].match(bounty[id!])) {
                    minelist.splice(e, 1);
                    await db.collection("WordSolver").doc(interaction.user.id).set({ solved: minelist }, { merge: true });
                    isUserWord = true;
                    break;
                }
            }
            if (isUserWord) {
                for (let e in bountylist) {
                    if (bountylist[e].split(":")[0].match(original)) {
                        bountylist.splice(e, 1);
                        await db.collection("WordSolver").doc("BountyList").set({ words: bountylist }, { merge: true });
                        break;
                    }
                }
            }
            const user = (await db.collection("WordSolver").doc(solverid).get()).data()!;
            const coinsTOGive = user!.coins;
            await db.collection("WordSolver").doc(solverid).set({ coins: coinsTOGive + parseInt(coins) }, { merge: true });
            const messageembed = new MessageEmbed()
            .setTitle("Bounty words")
            .setColor(`#${msg.helpembedcolor}`)
            .setDescription(`CONGRATS! [${interaction.client.users.cache.get(solverid)?.username}](https://discord.com/users/${solverid}) solved **${original}**! Solution: **${solved}**`);
            interaction.editReply({ embeds: [messageembed] });
    }
}