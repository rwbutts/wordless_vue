interface KeyPressEventArgs { character: string }; 
interface ResetGameEventArgs { answer: string }; 
interface ResetKeyEventArgs {  };

interface LetterColor{
     letter: string,
     color: string,
};

interface StatsReportGameResult {
     finalState: string,
     numGuesses?: number,
};
