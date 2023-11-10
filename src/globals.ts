interface KeyPressEventArgs { character: string }; 
interface ResetGameEventArgs { answer: string }; 
interface ResetKeyEventArgs {  };

interface StatsReportGameResult {
     finalState: string,
     numGuesses?: number,
};
