export const KeyCodes =  class 
{
     static ENTER = "ENTER";
     static DELETE = "DELETE";
     static ALPHA = "ALPHA";
     static NONALPHA = "SPECIAL";
     static ALL = "ALL";
     static RESET = 'RESET';
     static M_NEWWORD = ['ALPHA'];
     static M_KEYS1_4 = ['ALPHA', 'DELETE'];
     static M_KEY5 = ['DELETE', 'ENTER'];
     static M_GAMEOVER = ['RESET'];
     static M_RESETTING= ['-'];
     static M_LOADFAIL= ['-'];
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
     KB_CONFIG = 'enable-keys',
     GUESS_SUBMITTED = 'guess-validating',
     GUESS_VALIDATED = 'guess-validated',
     POST_LETTER = 'post-letter',
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

export class KBCommandEventArgs extends EventArgs
{ 
    public cmd: KBCommandTypes;
    public keys?: string[];
    public color?: MatchCodes;
    public enabled?: Boolean;
    constructor( sender: any, cmd: KBCommandTypes, keys?: string[], color?: MatchCodes, enabled? : Boolean )
    { 
        super(CustomEventNames.KB_CONFIG, sender);
        this.cmd=cmd;
        this.color=color;
        this.keys=keys?.flat();
        this.enabled=enabled;
    }
}

export class PostLetterEventArgs extends EventArgs
{ 
    public row: string;
    public col: string;
    public letter: string;
    constructor( sender: any, letter:string, row: string, col: number)
    { 
        super(CustomEventNames., sender);
        this.row=row;
        this.col=col;
        this.letter=letter;
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

export class SetMessageEventArgs extends EventArgs
{ 
    public message: string;
    constructor( sender: any, message: string)
    { 
        super(CustomEventNames.SET_MESSAGE, sender);
        this.message=message;
    }
}

export class GuessSubmittedEventArgs extends EventArgs
{ 
    public correct: boolean;
    constructor( sender: any, correct: boolean)
    { 
        super(CustomEventNames.KEY_PRESS, sender);
        this.correct=correct;
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
