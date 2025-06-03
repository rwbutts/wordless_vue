export const enum EventNames{ KB_RAWKEY='kb_raw_key',  
    LOAD_WORD='load_word', GUESS_ACCEPTED='guess_accepted', WORD_LOADED='word_loaded', GAME_OVER='game_over',
}

export type PlainObject = Record<string, any>;

export interface BaseEvt extends PlainObject {}
export interface GameOverEvt extends BaseEvt { won: boolean }  
export interface KBRawKeyClickEvt extends BaseEvt { key: string}
export interface GuessAcceptedEvt extends BaseEvt { guess_number: number, }
export interface WordLoadedEvt extends BaseEvt { word: string, }
export interface RequestWordLoadEvt extends BaseEvt { }

export interface EvtHandler{ event: string, handler: (x?: any) => void, This?: object, _boundHandler?: (x?: any) => void }

export interface ISharedState { guessNumber: number, cursorColumn: number, answer: string, guesses: Array<Array<string>>, statusMessage: string, 
                                statModalIsActive: boolean, gamePlayState: GamePlayStates, enableHardMode: boolean, guessList: string[], 
                                cssGuessNotEmpty: boolean, cssGuessIsFullWord: boolean, cssGuessNotFullWord: boolean,
                                keyObjectMap: PlainObject, }
export const enum GamePlayStates { BOOTING_UP, IN_PROGRESS, WON, LOST }
export const enum GuessEntryStatus{ IS_NOT_EMPTY='guess-is-not-empty', IS_FULL_WORD='guess-is-full-word', IS_NOT_FULL_WORD='guess-is-not-full-word', }
