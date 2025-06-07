export type TypedAccess<T> = { [K in keyof T]: T[K]; };
export type SafeIndexer<T> = { [K in keyof T]: T[K]; };

export type PlainObject = Record<string, unknown>;
export type EventHandler<T = unknown> = (event: T) => void;
export const enum EventNames{ KB_RAWKEY='kb_raw_key',  
    TRIGGER_WORD_LOAD='load_word', GUESS_ACCEPTED='guess_accepted', WORD_LOADED='word_loaded', GAME_OVER='game_over',
}


export type BaseEvt = Record<string, unknown>;
export type EmptyObject = Record<string, never>
export interface GameOverEvt extends BaseEvt { won: boolean, guesses: number, }  
export interface KBRawKeyClickEvt extends BaseEvt { key: string}
export interface WordLoadedEvt extends BaseEvt { word: string, }
//export interface SetComponentClassEvt extends BaseEvt { targetClass: string, targetInstance?: string, classes: Record<string, boolean> }
export type  RequestWordLoadEvt = EmptyObject

export interface KbControlKeysCss {enable_delete: boolean, enable_enter: boolean}

export const enum GamePlayStates { LOADING_WORD='gamestate-loading', PLAYING='gamestate-playing', WON='gamestate-won', LOST='gamestate-lost' }

export const enum MatchCodes { DEFAULT= 'default', MISS= 'miss', ELSEWHERE= 'elsewhere', CORRECT= 'correct' }

export const enum KeyCodes { ENTER = "ENTER", DELETE = "DELETE", ALPHA = "ALPHA", NONALPHA = "SPECIAL", ALL = "*", RESET = 'RESET' }

export interface ILetterColorPair { letter: string, color: MatchCodes }

export class LetterColorPair {
    color: MatchCodes;
    letter: string;
    
    constructor( letter = '', color: MatchCodes = MatchCodes.DEFAULT) {
        this.color = color;
        this.letter = letter;
    }

    static createScoredLetter( guessLetter: string, answer: string, guessColumn: number ) : LetterColorPair {
        const color = (guessLetter === answer.charAt(guessColumn)) ? MatchCodes.CORRECT : (answer.includes(guessLetter) ? MatchCodes.ELSEWHERE : MatchCodes.MISS);
        return new LetterColorPair(guessLetter, color);
    }
    static empty(  ): LetterColorPair {
        return new LetterColorPair();
    }
    static create( letter = '', color: MatchCodes = MatchCodes.DEFAULT): LetterColorPair {
        return new LetterColorPair(letter, color);
    }
}

export interface IClassifiedKeyRefs { all: string[], alpha: string[], nonalpha: string[],  }