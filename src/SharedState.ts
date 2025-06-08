import { GamePlayStates, LetterColorPair,} from './types'
import Vue from 'vue';

export  type ISharedState  = ReturnType<typeof createStateInstance>

function createStateInstance() {

    const letterGrid: LetterColorPair[][] = [];
    for(let r=0; r<6;r++) {
        const R = [];
        for( let c=0; c<5; c++ ) {
            R.push(LetterColorPair.empty());
        }
        letterGrid.push(R);
    }

    return {
        appVersion: process.env.VUE_APP_VERSION, 
        apiVersion: '',
        cursorRow: 0,
        cursorColumn: 0,
        answer: '',
        guessList: [] as string[],
        letterGrid,
        // letterGrid: [
        //     [ LetterColorPair.create("01"),LetterColorPair.create("12"),LetterColorPair.create("13"),LetterColorPair.create("14"),LetterColorPair.create("15")], 
        //     [ LetterColorPair.create("21"),LetterColorPair.create("22"),LetterColorPair.create("23"),LetterColorPair.create("24"),LetterColorPair.create("25")], 
        //     [ LetterColorPair.create("31"),LetterColorPair.create("32"),LetterColorPair.create("33"),LetterColorPair.create("34"),LetterColorPair.create("35")], 
        //     [ LetterColorPair.create("41"),LetterColorPair.create("42"),LetterColorPair.create("43"),LetterColorPair.create("44"),LetterColorPair.create("45")], 
        //     [ LetterColorPair.create("51"),LetterColorPair.create("52"),LetterColorPair.create("53"),LetterColorPair.create("54"),LetterColorPair.create("55")], 
        //     [ LetterColorPair.create("61"),LetterColorPair.create("62"),LetterColorPair.create("63"),LetterColorPair.create("64"),LetterColorPair.create("65")], 
        // ],    
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
