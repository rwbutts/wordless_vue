import { MatchCodes, KeyCodes,  } from './types'

export const enum EventNames{ KB_RAWKEY='kb_raw_key', KB_STYLE='kb_style', UI_MESSAGE= 'ui_message', 
    LOAD_WORD='load_word', GUESS_ACCEPTED='guess_accepted', WORD_LOADED='word_loaded', GAME_OVER='game_over',
}

export type PlainObject = Record<string, any>;

export interface BaseEvt extends PlainObject {}
export interface KBKeyStyleEvt extends BaseEvt { styles: KBKeyStyle|[] }  
export interface GameOverEvt extends BaseEvt { won: boolean }  
export interface KBRawKeyClickEvt extends BaseEvt { key: string}
export interface UILetterEvt extends BaseEvt { row_number?: number, col_number?: number, letter:string, color?: MatchCodes, focus?: boolean}
export interface GuessAcceptedEvt extends BaseEvt { guess_number: number, }
export interface WordLoadedEvt extends BaseEvt { word: string, }
export interface RequestWordLoadEvt extends BaseEvt { }

export interface EvtHandler{ event: string, handler: (x?: any) => void, This?: object, _boundHandler?: (x?: any) => void }

export  interface KBKeyStyle { key:string, color?:MatchCodes, enabled?:boolean }
export class KBStylePresets {
    static EDIT_WORD_BLANK: KBKeyStyle[] = [{key:KeyCodes.ALPHA, color: MatchCodes.DEFAULT, enabled: true,},
                        {key:KeyCodes.NONALPHA, color: MatchCodes.DEFAULT, enabled: false, }, ];
    static EDITING_WORD_PARTIAL: KBKeyStyle[] = [{key:KeyCodes.DELETE, enabled: true,}, {key:KeyCodes.ENTER, enabled: false,} ];
    static EDITING_WORD_FULL: KBKeyStyle[] = [{key:KeyCodes.ALPHA, enabled: false,}, {key:KeyCodes.ENTER, enabled: true,} ];
    static EDITING_GAME_OVER: KBKeyStyle[] = [{key:KeyCodes.NONALPHA, enabled: false,}, {key:KeyCodes.RESET, enabled: true,} ];
}
export interface ISharedState { guessNumber: number, cursorColumn: number, answer: string, guesses: Array<Array<string>>, statusMessage: string, 
                                statModalIsActive: boolean, gamePlayState: GamePlayStates, enableHardMode: boolean, guessList: string[], 
                                cssGuessNotEmpty: boolean, cssGuessIsFullWord: boolean, cssGuessNotFullWord: boolean }
export const enum GamePlayStates { BOOTING_UP, IN_PROGRESS, WON, LOST }
export interface LetterColorPair {letter: string, color: MatchCodes}
export const enum GuessEntryStatus{ IS_NOT_EMPTY='guess-is-not-empty', IS_FULL_WORD='guess-is-full-word', IS_NOT_FULL_WORD='guess-is-not-full-word', }
