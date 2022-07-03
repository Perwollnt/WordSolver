import { readFileSync } from 'fs';
import { set } from 'quick.db';
export class DatabaseManager {
    constructor() {

    }
    scrambledWords: any[] = [];
    normalWords: any[] = [];

    async loadDB() {
        const lines = readFileSync("szavak.txt", "utf8").split("\n");
        for(let e of lines) {
            this.scrambledWords.push(sortWord(e));
            this.normalWords.push(e);
        }
        set('normalWords', this.normalWords);
        set('scrambledWords', this.scrambledWords);
        return this.scrambledWords.length;
    }
}
export async function sortWord(word: String) {
    return word.split("").sort().join("");
}