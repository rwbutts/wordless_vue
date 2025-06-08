import { GamePlayStates, LetterColorPair,} from './types'
import Vue from 'vue';

export  type ISharedState  = ReturnType<typeof createStateInstance>

function createStateInstance() {

    const letterGrid: LetterColorPair[][] = [];
    for(let r=0; r<6;r++) {
        letterGrid.push([LetterColorPair.empty(), LetterColorPair.empty(), LetterColorPair.empty(), LetterColorPair.empty(), LetterColorPair.empty(), ]);
    }

    return {
        appVersion: process.env.VUE_APP_VERSION, 
        apiVersion: '',
        cursorRow: 0,
        cursorColumn: 0,
        answer: '',
        guessList: [] as string[],
        letterGrid,
        statusMessage: '',
        statModalIsActive: false,
        gamePlayState: GamePlayStates.LOADING_WORD,
        enableHardMode: false,
    };
}

const defaultDoNotResetFieldList = [ 'enableHardMode', ];

const SharedState: ISharedState = Vue.observable(createStateInstance());

export default (()=>(SharedState)) as ()=>ISharedState;

// eslint-disable-line @typescript-eslint/no-explicit-any
export const resetSharedState = function (): void {
        const newState = createStateInstance();
        (Object.keys(newState) as Array<keyof ISharedState> )
            .filter( (key) => !defaultDoNotResetFieldList.find((dnrKey) => dnrKey===key))
            .forEach( (k) => Vue.set(SharedState, k, newState[k] ));  
        console.log('resetSharedState()', SharedState) ;
    }


export const statusMsg = (( message: string )=>{ SharedState.statusMessage = message;}) as (message:string) => void;
