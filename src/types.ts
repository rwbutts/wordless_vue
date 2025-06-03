export const KeyCodes =  class 
{
     static ENTER = "ENTER";
     static DELETE = "DELETE";
     static ALPHA = "ALPHA";
     static NONALPHA = "SPECIAL";
     static ALL = "*";
     static RESET = 'RESET';
}

export const enum KBCommandTypes
{
     KB_RESET_ONLY = "kb-reset-only",
     KB_NO_DELETE = "kb-no-delete",
     KB_NO_ENTER = "kb-no-enter",
     KB_ENTER_ONLY = "kb-enter-only",
     KB_SET_KEY_COLOR = "kb-set-color"
}
     
export const enum MatchCodes 
{
     DEFAULT= 'default',
     MISS= 'miss',
     ELSEWHERE= 'elsewhere',
     CORRECT= 'correct'
}

export const enum GameStates
{
     INIT = "game-starting",
     WON = "game-won",
     LOST = "game-lost",
     ENDING = "end-in-progress",
     RUNNING = "game-in-progress",
     GAMEOVER = "game-over",
}



export interface IKeyPressEventArgs { character: string }
export interface IResetGameEventArgs { answer: string } 
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IResetKeyEventArgs {  }

export interface LetterColor{
     letter: string,
     color: string,
}

export interface IStatsReportGameResult {
     finalState: string,
     numGuesses?: number,
}


export const enum CustomEventNames 
{
     INITIALIZE = 'initialize',
     GAME_OVER = 'game-over',
     KEY_PRESS = 'key-press',
     WORD_LOADED = 'new-word',
     SET_MESSAGE = 'set-message',
}

export class EventArgs 
{ 
    [key: string|symbol]: unknown;

    public event: string; 
    public sender: any;
    constructor( event: string, sender: any  ){ 
        this.event=event;
        this.sender=sender;
    } 
}

export class KeyPressEventArgs extends EventArgs
{ 
    public char: string;
    public isNonAlpha : boolean;
    constructor( sender: any, char: string, isNonAlpha : boolean = false)
    { 
        super(CustomEventNames.KEY_PRESS, sender);
        this.char=char;
        this.isNonAlpha = isNonAlpha;
    }
}

export class GameOverEventArgs extends EventArgs
{ 
    public won: boolean;
    public guesses: number;
    constructor( sender:any, won: boolean, guesses: number=0)
    { 
        super(CustomEventNames.GAME_OVER, sender);
        this.won=won;
        this.guesses=guesses;
    }
}

export class WordLoadedEventArgs extends EventArgs
{ 
    public answer: string;
    constructor( sender: any, answer: string )
    { 
        super(CustomEventNames.WORD_LOADED, sender);
        this.answer=answer;
    }
}

export class InitializeEventArgs extends EventArgs
{ 
    constructor(sender: any )
    { 
        super(CustomEventNames.INITIALIZE, sender);
    }
}
