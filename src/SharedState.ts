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
        letterGrid: [
            [ LetterColorPair.create("01"),LetterColorPair.create("12"),LetterColorPair.create("13"),LetterColorPair.create("14"),LetterColorPair.create("15")], 
            [ LetterColorPair.create("21"),LetterColorPair.create("22"),LetterColorPair.create("23"),LetterColorPair.create("24"),LetterColorPair.create("25")], 
            [ LetterColorPair.create("31"),LetterColorPair.create("32"),LetterColorPair.create("33"),LetterColorPair.create("34"),LetterColorPair.create("35")], 
            [ LetterColorPair.create("41"),LetterColorPair.create("42"),LetterColorPair.create("43"),LetterColorPair.create("44"),LetterColorPair.create("45")], 
            [ LetterColorPair.create("51"),LetterColorPair.create("52"),LetterColorPair.create("53"),LetterColorPair.create("54"),LetterColorPair.create("55")], 
            [ LetterColorPair.create("61"),LetterColorPair.create("62"),LetterColorPair.create("63"),LetterColorPair.create("64"),LetterColorPair.create("65")], 
        ],
//letterGrid: Array(5).fill([ LetterColorPair.empty(),LetterColorPair.empty(),LetterColorPair.empty(),LetterColorPair.empty(),LetterColorPair.empty(), ]),
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
