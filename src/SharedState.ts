import { GamePlayStates, LetterColorPair, PlainObject, } from './types'
import Vue from 'vue';

// export interface ISharedState extends PlainObject { cursorRow: number, cursorColumn: number, answer: string, letterGrid: LetterColorPair[][], statusMessage: string, 
//     statModalIsActive: boolean, gamePlayState: GamePlayStates, enableHardMode: boolean, guessList: string[], appVersion: string, apiVersion:string,  }
export  type ISharedState  = ReturnType<typeof createStateInstance>

function createStateInstance() {

    const letterGrid : LetterColorPair[][] = [];
    for( let r=0; r<6; r++ )
        for( let c=0; c<5; c++ )
                letterGrid[r][c] = LetterColorPair.empty();

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
        Object.keys(newState)
            .filter( (key) => defaultDoNotResetFieldList.find((dnrKey) => dnrKey===key))
            .forEach( (k ) => Vue.set(SharedState, k, newState[k] ));   
    }


export const statusMsg = (( message: string )=>{ SharedState.statusMessage = message;}) as (message:string) => void;
