export const enum KeyCodes
{
     ENTER = "ENTER",
     DELETE = "BACKSPACE",
     LETTER = "LETTER",
     ALL = "ALL",
     RESET = 'RESET'
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

export const enum CustomEventNames 
{
     RESET_KEY = 'user-reset-key',
     RESET_COMPONENTS = "init-components",
}

export interface KeyPressEventArgs { character: string }
export interface ResetGameEventArgs { answer: string } 
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ResetKeyEventArgs {  }

export interface LetterColor{
     letter: string,
     color: string,
}

export interface StatsReportGameResult {
     finalState: string,
     numGuesses?: number,
}

export interface KeyPressEventArgs { character: string }

export interface ResetGameEventArgs { answer: string } 

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ResetKeyEventArgs {  }


