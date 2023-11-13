interface KeyPressEventArgs { character: string }; 
interface ResetGameEventArgs { answer: string }; 
interface ResetKeyEventArgs {  };

interface CalcLetterColorResponse{
     letter: string,
     color: string,
};

interface StatsReportGameResult {
     finalState: string,
     numGuesses?: number,
};
