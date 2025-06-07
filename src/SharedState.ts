import { GamePlayStates, KbControlKeysCss, LetterColorPair, PlainObject, } from './types'
import Vue from 'vue';

export interface ISharedState extends PlainObject { cursorRow: number, cursorColumn: number, answer: string, letterGrid: Array<Array<LetterColorPair>>, statusMessage: string, 
    statModalIsActive: boolean, gamePlayState: GamePlayStates, enableHardMode: boolean, guessList: string[], 
kbControlKeysCss: KbControlKeysCss, appVersion: string, apiVersion:string,  }

function createStateInstance(): ISharedState{
    return {
        appVersion: process.env.VUE_APP_VERSION, 
        apiVersion: '',
        cursorRow: 0,
        cursorColumn: 0,
        answer: '',
        guessList: [] as string[],
        letterGrid: Array(5).fill([ LetterColorPair.empty(),LetterColorPair.empty(),LetterColorPair.empty(),LetterColorPair.empty(),LetterColorPair.empty(), ]),
        statusMessage: '',
        statModalIsActive: false,
        gamePlayState: GamePlayStates.LOADING_WORD,
        enableHardMode: false,
        kbControlKeysCss: { enable_delete: false, enable_enter: false,  },
    };
}

const doNotResetFieldList = [ 'enableHardMode', ];

//const SharedState: ISharedState = Vue.observable(createStateInstance());
const SharedState: ISharedState = Vue.observable(createStateInstance());

export default (()=>(SharedState)) as ()=>ISharedState;

// eslint-disable-line @typescript-eslint/no-explicit-any
export const resetSharedState = function (): void {
    const newState = createStateInstance();
    Object.keys(newState)
        .filter( (key)=>doNotResetFieldList.find( (dnrKey) => dnrKey===key))
        .forEach( (k ) => Vue.set(SharedState, k, newState[k] ));   }


export const statusMsg = (( message: string )=>{ SharedState.statusMessage = message;}) as (message:string)=>void;
