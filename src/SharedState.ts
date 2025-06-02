import { ISharedState, } from './types2'
import Vue from 'vue';

const SharedState = Vue.observable({
    guessNumber: 0,
    cursorColumn: 0,
    answer: '',
    guesses: Array(5).fill(['', '', '', '', '', '']),
    statusMessage: '',
});

export default ()=>(SharedState as ISharedState);