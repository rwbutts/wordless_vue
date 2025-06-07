<template>
    <div>
        <div class='guess-list'>
            <guess-word v-for="row in 6" :letterRowArrayProp="letterGrid[row-1]" :myRowProp="row-1" :key='row'>
            </guess-word>
        </div>
        <div class='status-area'>
                <h3 class='status status-game-in-progress'> {{ statusMessage }}</h3> 
                <h3 class='status status-game-lost'>Sorry, the answer is {{ answer }}</h3> 
                <h3 class='status status-game-won'>Congratulations, you got it! Please hire me!</h3> 
        </div>
        
        <keyboard ref="keyboard" :class="{enable_delete: (cursorColumn >= 1), enable_enter: (cursorColumn >= 5), }" />
    </div>
</template>

<script lang='ts'>
"use strict";
// @ts-check

import Keyboard from '@/components/Keyboard.vue'
import Vue, { PropType } from 'vue'
import GuessWord from './GuessWord.vue'
import { EventNames, EventHandler, WordLoadedEvt, GameOverEvt, 
    GamePlayStates, KeyCodes, MatchCodes, LetterColorPair, ILetterColorPair, PlainObject, KBRawKeyClickEvt,
    RequestWordLoadEvt, } from '@/types'
import EventBus from '@/EventBus';
import SharedState, { resetSharedState, statusMsg,  } from '@/SharedState'
import { wordlessApiService, CheckWordAsyncResponseType } from '@/WordlessAPI'

export default Vue.extend({
    name: 'guess-list',
/*
    data(){
        return {
            appVersion: process.env.VUE_APP_VERSION, 
            apiVersion: '',
            cursorRow: 0,
            cursorColumn: 0,
            answer: '',
            guessList: [] as string[],
            letterGrid: [
                    [ LetterColorPair.create("11"),LetterColorPair.create("12"),LetterColorPair.create("13"),LetterColorPair.create("14"),LetterColorPair.create("15")], 
                    [ LetterColorPair.create("21"),LetterColorPair.create("22"),LetterColorPair.create("23"),LetterColorPair.create("24"),LetterColorPair.create("25")], 
                    [ LetterColorPair.create("31"),LetterColorPair.create("32"),LetterColorPair.create("33"),LetterColorPair.create("34"),LetterColorPair.create("35")], 
                    [ LetterColorPair.create("41"),LetterColorPair.create("42"),LetterColorPair.create("43"),LetterColorPair.create("44"),LetterColorPair.create("45")], 
                    [ LetterColorPair.create("51"),LetterColorPair.create("52"),LetterColorPair.create("53"),LetterColorPair.create("54"),LetterColorPair.create("55")], 
                    [ LetterColorPair.create("61"),LetterColorPair.create("62"),LetterColorPair.create("63"),LetterColorPair.create("64"),LetterColorPair.create("65")], 
                ],
            statusMessage: '',
            statModalIsActive: false,
            gamePlayState: GamePlayStates.LOADING_WORD,
            enableHardMode: false,
            kbControlKeysCss: { enable_delete: false, enable_enter: false,  },
        };
    },
*/
    data : SharedState,
    components: { GuessWord, Keyboard },
    computed: {
        SS() {
            return this;
        }
    },
    mounted() {
        EventBus.On(EventNames.WORD_LOADED, this.onWordLoaded.bind(this) as EventHandler);
        EventBus.On(EventNames.TRIGGER_WORD_LOAD, this.onTriggerWordLoad.bind(this) as EventHandler);
        EventBus.On(EventNames.KB_RAWKEY, this.keyEventHandler.bind(this) as EventHandler);
        console.log("foo", this.getSharedState().letterGrid);
    },

    methods: {
        getSharedState( ){
            return SharedState();
        },
        scoreGuessLetter( guessLetter: string, cursorColumn?:number ): ILetterColorPair {
            const color = (guessLetter === this.answer.charAt(cursorColumn ?? this.cursorColumn)) ? MatchCodes.CORRECT : (this.answer.includes(guessLetter) ? MatchCodes.ELSEWHERE : MatchCodes.MISS);
            return {color: color, letter: guessLetter } as LetterColorPair;
        },
        setKeyColors() {
            this.letterGrid[this.cursorRow].forEach( (pair:LetterColorPair) =>{
                (this.$refs['keyboard'] as InstanceType<typeof Keyboard>)?.setKeyColor( pair.letter, pair.color );
            });
        },
        resetState() {
            resetSharedState( );
        },
        onWordLoaded(evt: WordLoadedEvt) {
            this.resetState();

            this.answer = evt.word;
            this.gamePlayState = GamePlayStates.PLAYING;
        },
        // tslint:disable no-unused-vars
        async onTriggerWordLoad(_evt: RequestWordLoadEvt) 
        {
               const response = await wordlessApiService.getWordAsync();
               if( response.success )
               {
                    statusMsg( 'Guess the 5-letter word in 6 tries. Good luck!' );
                    this.apiVersion = response.apiVersion ?? '';
                    EventBus.emit( EventNames.WORD_LOADED, {word: response.word} as WordLoadedEvt );
               }
               else
               {
                    statusMsg( `Error loading word - ${response.message}. Refresh page to retry.` );
               }
        },
        async keyEventHandler(eventArgs: KBRawKeyClickEvt): Promise<void> {
            const SS = this.SS;
            const key = eventArgs.key;

            statusMsg('');
            const len = this.cursorColumn;
            const row = this.cursorRow;

            switch (true) {
                case key === KeyCodes.ENTER && len >= 5:
                    await this.validateAndAcceptWord();
                    break;
                case key === KeyCodes.DELETE && len > 0:
                    this.$set(this.letterGrid[row], --this.cursorColumn, LetterColorPair.empty());
                    break;
                case key.length === 1 && key >= 'A' && key <= 'Z' && len < 5:
                    this.$set(this.letterGrid[row], this.cursorColumn++, this.scoreGuessLetter(key));
                    break;
                default:
                    return;
            }
        },
        async validateAndAcceptWord() {
            const SS = this.SS;
            const completedGuessWord = this.letterGrid[this.cursorRow].slice(0, this.cursorColumn).reduce( (acc: string, item:LetterColorPair )=> acc + item.letter, '');
            const resp = await this.validateExistsApiCall(completedGuessWord);
            switch(resp.exists)
            {
                case false:
                    // word is NOT a dictionary word.  Keep editing this word.
                    if (completedGuessWord === "xyzzy") {
                        statusMsg(`( ${this.answer} is the answer :)`);
                    }
                    else {
                        statusMsg(`Sorry, ${completedGuessWord} is not in my dictionary!`);
                    }
                    
                    // erase the last letter and moe cursor back onto screen to make the word editable again
                    this.$set(this.letterGrid[this.cursorRow], --this.cursorColumn, LetterColorPair.empty());
                    break;
                case true:
                            // Word is valid.  Process the accepted guethis.
                    this.guessList.push(completedGuessWord);
                    this.setKeyColors();

                    // Move to next row (this triggers the css reveal of the row colors) and resets cursor back to start
                    this.cursorColumn = 0;
                    this.cursorRow++;

                    // see if we've won or lost.  
                    // Guesses is a 1-based count, so already-incremented S.guessNumber (0-5 playing, 6 if we've lost) is the 1-6 we want.
                    if (completedGuessWord === this.answer) {
                        this.gamePlayState = GamePlayStates.WON;
                        EventBus.emit(EventNames.GAME_OVER, { won: true, guesses: this.cursorRow } as GameOverEvt);
                    }
                    else if (this.cursorRow >= 6) {
                        this.gamePlayState = GamePlayStates.LOST;
                        EventBus.emit(EventNames.GAME_OVER, { won: false, guesses: this.cursorRow } as GameOverEvt);
                    }
                    else
                        await this.displayMatchingWordCount(this.answer, this.guessList);

                    break;
                case undefined:
                    statusMsg(`Error validating word: ${resp.message}. Try again in a few moments.`);
                    break;
            }
        },
        async displayMatchingWordCount(answer: string, guesses: string[]): Promise<void> {
            const apiResp = await wordlessApiService.getMatchCountAsync(answer, guesses);
            if (!apiResp.success) {
                statusMsg(`Failed to calc remaining: ${apiResp.message}`);
            } else {
                statusMsg(`${apiResp.count} remaining word(s) match the clues above.`);
            }
        },
        async validateExistsApiCall(word: string): Promise<CheckWordAsyncResponseType> {
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