/* eslint-disable @typescript-eslint/no-unused-vars */

interface KeyPressEventArgs { character: string }
interface ResetGameEventArgs { answer: string } 
// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface ResetKeyEventArgs {  }

interface LetterColor{
     letter: string,
     color: string,
}

interface StatsReportGameResult {
     finalState: string,
     numGuesses?: number,
}
