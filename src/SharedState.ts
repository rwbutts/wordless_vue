import { ISharedState, GamePlayStates, PlainObject } from './types2'
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
        enableHardMode: false,
        cssGuessNotEmpty: false,
        cssGuessIsFullWord: false,
        cssGuessNotFullWord: false,
        keyObjectMap: [] as PlainObject,
    };
}

const SharedState: ISharedState = Vue.observable(getStateInstance());

export default (()=>(SharedState)) as ()=>ISharedState;

export const resetSharedState = function ( append: PlainObject = {}) {
    Object.assign(SharedState, getStateInstance(), append );
}