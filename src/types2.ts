import { MatchCodes } from './types'
export  interface KBKeyStyle { key:string, color?:MatchCodes, enabled?:boolean }
export interface KBKeyStyleEvt { event?: string, styles: KBKeyStyle|[] }
export interface KBRawKeyClickEvt { event:string, key: string}
export interface UILetterEvt { event?: string, row_number?: number, col_number?: number, letter:string, color?: MatchCodes, focus?: boolean}
export interface GuessAcceptedEvt { event?: string, guess_number: number, }
export interface WordLoadedEvt { event?: string, word: string, }
export const enum EventNames{ KB_RAWKEY='kb_raw_key', KB_STYLE='kb_style', UI_STYLE='ui_style', UI_MESSAGE= 'ui_message', LOAD_WORD='load_word', GUESS_ACCEPTED='guess_accepted',
                                WORD_LOADED='word_loaded'
}
export interface EvtReceiver{ event: string, handler: (x?: any) => void, This?: object, _boundHandler?: (x?: any) => void }
export interface ISharedState { guessNumber: number, cursorColumn: number, answer: string, guesses: Array<Array<string>>, statusMessage: string, }
