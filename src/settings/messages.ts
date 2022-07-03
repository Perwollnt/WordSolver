// < HELP embed >
export const helpembed = [{
    title: "/help",
    value: "Show this help message."
},{
    title: "/solve [word: word to find]",
    value: "Solves a word."
}, {
    title: "/bounty create [word: word to find] [coinAmmount: Ammount of coins to reward]",
    value: "Creates a bounty."
},{
    title: "/bounty list",
    value: "Lists all(or if too much top paying) bounties."
}]
export const helpembedtitlehu = "Szófejtő";
export const helpembeddeschu = "Bot by perwolln't";
export const helpembedcolor = "36393F";

export const helpembedtitleen = "WurdUnscrambler";
export const helpembeddescen = "Bot by perwolln't";

// < FOUND word embed >
export const foundembedtitle = "A `%mw` szóból `%sh` felelt meg a kritériumaidnak és `%tm` másodpercig"; // %sh = nunber of found words %mw = number of all words %tm = time it took to find the words
export const notfoundembedtitle = "Nem találtam egy szót sem ami megfelelne (elpocsékolt idő: %tm)" // %tm = time it took to NOT find the words
export const foundembedcolor = "36393F";

// < STARTUP message >
export const clientreadymessage = `Logged in as %un! with %mw words available to use.` // %un = Bot name, %mw = number of words in the list

// < ADDWORD message >
export const addwordsuccess = "Szó sikeresen hozzáadva✅";
export const addworderrorr = "Szó hozzáadás sikertelen❌";

// < BOUNTY message >
export const bountyreaction = "💰";
export const bountymessage = "A szót hozzáadtam a bónuszlistához.";
export const bountyfailed = "Nem sikerült hozzáadni a szót a bónuszlistához.";
export const bountycost = 1;