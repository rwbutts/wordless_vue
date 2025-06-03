import { ISharedState, GamePlayStates, } from './types2'
import Vue from 'vue';

function getStateInstance() {
    return {
        guessNumber: 0,
        cursorColumn: 0,
        answer: '',
        guessList: [] as string[],
        guesses: Array(5).fill(['', '', '', '', '', '']),
        statusMessage: '',
        statModalIsActive: false,
        gamePlayState: GamePlayStates.BOOTING_UP,
        enableHardMode : false,
    
    };
}

const SharedState = Vue.observable(getStateInstance());

export default (()=>(SharedState)) ;

export const resetSharedState = function () {
    Object.assign(SharedState, getStateInstance());
}