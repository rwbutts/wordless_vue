export const enum EventNames{ KB_RAWKEY='kb_raw_key',  
    LOAD_WORD='load_word', GUESS_ACCEPTED='guess_accepted', WORD_LOADED='word_loaded', GAME_OVER='game_over',
}

export type PlainObject = Record<string, any>;

export interface BaseEvt extends PlainObject {}
export interface GameOverEvt extends BaseEvt { won: boolean, guesses: number, }  
export interface KBRawKeyClickEvt extends BaseEvt { key: string}
export interface GuessAcceptedEvt extends BaseEvt { guess_number: number, }
export interface WordLoadedEvt extends BaseEvt { word: string, }
export interface SetComponentClassEvt extends BaseEvt { targetClass: string, targetInstance?: string, classes: Record<string, boolean> }
export interface RequestWordLoadEvt extends BaseEvt { }

export interface EvtHandler{ event: string, handler: (x?: any) => void, This?: object, _boundHandler?: (x?: any) => void }

export interface KbControlKeysCss {enable_delete: boolean, enable_enter: boolean}

export const enum GamePlayStates { LOADING_WORD='gamestate-loading', PLAYING='gamestate-playing', WON='gamestate-won', LOST='gamestate-lost' }

export const enum MatchCodes { DEFAULT= 'default', MISS= 'miss', ELSEWHERE= 'elsewhere', CORRECT= 'correct' }

export const enum KeyCodes { ENTER = "ENTER", DELETE = "DELETE", ALPHA = "ALPHA", NONALPHA = "SPECIAL", ALL = "*", RESET = 'RESET' }

export interface ILetterColorPair { letter: string, color: MatchCodes }

export class LetterColorPair {
    color: MatchCodes;
    letter: string;
    constructor( letter: string='', color: MatchCodes = MatchCodes.DEFAULT) {
        this.color = color;
        this.letter = letter;
    }

    static createScoredLetter( guessLetter: string, answer: string, guessColumn: number ) : LetterColorPair {
        let newPair = new LetterColorPair();
        let color = (guessLetter === answer.charAt(guessColumn)) ? MatchCodes.CORRECT : (answer.includes(guessLetter) ? MatchCodes.ELSEWHERE : MatchCodes.MISS);
        return new LetterColorPair(guessLetter, color);
    }
    static empty( ) {
        return new LetterColorPair();
    }
}

export interface IClassifiedKeyRefs { all: string[], alpha: string[], nonalpha: string[],  }