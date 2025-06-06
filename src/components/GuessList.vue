<template>

    <div class='guess-list'>
        <guess-word v-for="row in 6" :letter_array_prop="letter_row_array_prop[row - 1]" :my_row_prop="row" :key='row'>
        </guess-word>
    </div>
    <div class='status-area'>
               <h3 class='status status-game-in-progress'> {{ SharedState.statusMessage }}</h3> 
               <h3 class='status status-game-lost'>Sorry, the answer is {{ SharedState.answer }}</h3> 
               <h3 class='status status-game-won'>Congratulations, you got it! Please hire me!</h3> 
    </div>
    
    <keyboard ref="keyboard" :class="{enable_delete: (SS.cursorColumn >= 1), enable_enter: (SS.cursorColumn >= 5), }" />
</template>

<script lang='ts'>
"use strict";
// @ts-check

import Keyboard from '@/components/Keyboard.vue'
import Vue, { PropType } from 'vue'
import GuessWord from './GuessWord.vue'
import { EventNames, EvtHandler, WordLoadedEvt, GuessAcceptedEvt, GameOverEvt, 
    GamePlayStates, KeyCodes, MatchCodes, LetterColorPair, ILetterColorPair, PlainObject, KBRawKeyClickEvt, } from '@/types'
import EventBus from '@/EventBus';
import SharedState, { resetSharedState } from '@/SharedState'
import { wordlessApiService, CheckWordAsyncResponseType } from '@/WordlessAPI'

export default Vue.extend({
    name: 'guess-list',

    data() {
        return {
            keyboardCssClasses : {} as PlainObject,
        };
    },

    components: { GuessWord, Keyboard },

    props:
    {
        'letter_row_array_prop': {
            type: Array<Array<LetterColorPair>> as PropType<Array<Array<LetterColorPair>>>,
            required: true,
        },
},

    computed: {
        SharedState,
        SS: SharedState,
    },
    mounted() {
        EventBus.On({ event: EventNames.WORD_LOADED, handler: this.onWordLoaded, This: this })
    },

    methods: {
        scoreGuessLetter( guessLetter: string, cursorColumn?:number ): ILetterColorPair {
            let color = (guessLetter === this.SS.answer.charAt(cursorColumn ?? this.SS.cursorColumn)) ? MatchCodes.CORRECT : (this.SS.answer.includes(guessLetter) ? MatchCodes.ELSEWHERE : MatchCodes.MISS);
            return {color: color, letter: guessLetter } as LetterColorPair;
        },
        setKeyColors() {
            this.SS.letterGrid[this.SS.cursorRow].forEach(pair=>{
                (this.$refs['keyboard'] as InstanceType<typeof Keyboard>)?.setKeyColor( pair.letter, pair.color );
            });
        },
        statusMsg(msg: string) {
            this.SS.statusMessage = msg;
        },
        resetState() {
            resetSharedState( );
        },
        onWordLoaded(evt: WordLoadedEvt) {
            this.resetState();

            this.SS.answer = evt.word;
            this.SS.gamePlayState = GamePlayStates.PLAYING;
        },
        async keyEventHandler(eventArgs: KBRawKeyClickEvt): Promise<void> {
            let SS = this.SS;
            let key = eventArgs.key;

            this.statusMsg('');
            let len = SS.currentCol;
            let row = SS.currentRow;

            switch (true) {
                case key === KeyCodes.ENTER && len >= 5:
                    let completedGuessWord = SS.letterGrid[row].slice(0, len).reduce( (acc, item:any )=> acc + item.letter, '');
                    let resp = await this.validateWord(completedGuessWord);
                    switch(resp.exists)
                    {
                        case false:
                            // word is NOT a dictionary word.  Keep editing this word.
                            if (completedGuessWord === "xyzzy") {
                                this.statusMsg(`( ${SS.answer} is the answer :)`);
                            }
                            else {
                                this.statusMsg(`Sorry, ${completedGuessWord} is not in my dictionary!`);
                            }
                            
                            // erase the last letter and moe cursor back onto screen to make the word editable again
                            this.$set(SS.letterGrid[row], --SS.cursorColumn, LetterColorPair.empty());
                            break;
                        case true:
                            // Word is valid.  Process the accepted guess.
                            SS.guessList.push(completedGuessWord);
                            this.setKeyColors();

                            // Move to next row (this triggers the css reveal of the row colors) and resets cursor back to start
                            SS.cursorColumn = 0;
                            SS.cursorRow++;

                            // see if we've won or lost.  
                            // Guesses is a 1-based count, so already-incremented S.guessNumber (0-5 playing, 6 if we've lost) is the 1-6 we want.
                            if (completedGuessWord === SS.answer) {
                                SS.gamePlayState = GamePlayStates.WON;
                                EventBus.emit(EventNames.GAME_OVER, { won: true, guesses: SS.cursorRow } as GameOverEvt);
                            }
                            else if (SS.cursorRow >= 6) {
                                SS.gamePlayState = GamePlayStates.LOST;
                                EventBus.emit(EventNames.GAME_OVER, { won: false, guesses: SS.cursorRow } as GameOverEvt);
                            }
                            else
                                await this.displayMatchingWordCount(this.SS.answer, this.SS.guessList);

                            break;
                        case undefined:
                            this.statusMsg(`Error validating word: ${resp.message}. Try again in a few moments.`);
                            break;
                    }
                    break;
                case key === KeyCodes.DELETE && len > 0:
                    this.$set(SS.letterGrid[row], --SS.cursorColumn, LetterColorPair.empty());
                    break;
                case key.length === 1 && key >= 'A' && key <= 'Z' && len < 5:
                    let letterAndColor = this.scoreGuessLetter(key);
                    this.$set(SS.letterGrid[row], SS.cursorColumn++, letterAndColor);
                    break;
                default:
                    return;
            }
        },

        async displayMatchingWordCount(answer: string, guesses: string[]): Promise<void> {
            let apiResp = await wordlessApiService.getMatchCountAsync(answer, guesses);
            if (!apiResp.success) {
                this.statusMsg(`Failed to calc remaining: ${apiResp.message}`);
            }
            else {
                this.statusMsg(`${apiResp.count} remaining word(s) match the clues above.`);
            }
        },

        async validateWord(word: string): Promise<CheckWordAsyncResponseType> {
            return await wordlessApiService.checkWordAsync(word);
        }


    },
});
</script>

<style>
.guess-letter {
    position: absolute;
    left: 0;
    top: 0;
    display: inline-block;
    width: 100%;
    height: 100%;
    font-size: min(7vw, 35px);
    font-weight: normal;
    font-family: Arial, sans-serif;
    transition: transform .75s;
    transform-style: preserve-3D;
}
</style>

<style scoped>
.guess-row {
    display: flex;
    justify-content: center;
}

.letter-container {
    position: relative;
    height: min(8vw, 40px);
    width: min(8vw, 40px);
    margin: min(.5vw, 5px);
    perspective: 500px;
    box-sizing: content-box;
    border: 3px solid #EEE;
}

.game-in-progress .guess-row.current>.letter-container {
    border: 3px solid #888;

}

.game-in-progress .guess-row.current>.letter-container.current {
    border: 3px solid #888;
    background-color: #fee;
}

.guess-row.previous .letter-container {
    border: 3px solid #888;
}

@keyframes shake {
    0% {
        transform: translate(1px, 1px) rotate(0deg);
    }

    10% {
        transform: translate(-1px, -2px) rotate(-2deg);
    }

    20% {
        transform: translate(-3px, 0px) rotate(2deg);
    }

    30% {
        transform: translate(3px, 2px) rotate(0deg);
    }

    40% {
        transform: translate(1px, -1px) rotate(3deg);
    }

    50% {
        transform: translate(-1px, 2px) rotate(-3deg);
    }

    60% {
        transform: translate(-3px, 1px) rotate(0deg);
    }

    70% {
        transform: translate(3px, 1px) rotate(-4deg);
    }

    80% {
        transform: translate(-1px, -1px) rotate(1deg);
    }

    90% {
        transform: translate(1px, 2px) rotate(0deg);
    }

    100% {
        transform: translate(1px, -2px) rotate(-3deg);
    }
}

/* reveal color as default grey, conditionally yellow or green */
.reveal .back {
    background-color: var(--color-miss);
}

.reveal .back.present {
    background-color: var(--color-elsewhere);
}

.reveal .back.correct {
    background-color: var(--color-correct);
}

/* when reveal class added, flip the wrapper div ocer to expose colored div */
.reveal .guess-letter {
    transform: rotateY(180deg);
}

.game-won .guess-row.reveal.correct {
    animation: shake 0.5s;
    animation-iteration-count: 2;
    animation-delay: 2s;
}

/* flip the columns .5s apart */
.reveal .letter-container:nth-child(2) .guess-letter {
    transition-delay: .5s;
}

.reveal .letter-container:nth-child(3) .guess-letter {
    transition-delay: 1s;
}

.reveal .letter-container:nth-child(4) .guess-letter {
    transition-delay: 1.5s;
}

.reveal .letter-container:nth-child(5) .guess-letter {
    transition-delay: 2s;
}

.reveal .letter-container:nth-child(6) .guess-letter {
    transition-delay: 2.5s;
}
</style>