import { PlainObject, GamePlayStates, KbControlKeysCss, LetterColorPair, ILetterColorPair } from './types'
import Vue from 'vue';

export interface ISharedState { cursorRow: number, cursorColumn: number, answer: string, letterGrid: Array<Array<LetterColorPair>>, statusMessage: string, 
    statModalIsActive: boolean, gamePlayState: GamePlayStates, enableHardMode: boolean, guessList: string[], 
kbControlKeysCss: KbControlKeysCss, appVersion: string, apiVersion:string, [key: string]: any }

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

const SharedState: ISharedState = Vue.observable(createStateInstance());

export default (()=>(SharedState)) as ()=>ISharedState;

export const resetSharedState = function () {
    let newState = createStateInstance();
    Object.keys(newState)
        .filter( (key)=>!doNotResetFieldList.find( (dnrKey) => dnrKey===key))
        .forEach( k => Vue.set(SharedState, k, newState[k] ));
}

export const statusMsg = (( message: string )=>{ SharedState.statusMessage = message;});
