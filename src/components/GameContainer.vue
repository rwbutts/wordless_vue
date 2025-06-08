<template>
    <div class='game-container disable-tap-zoom'
        :class="{ [SS.gamePlayState]: true, 'enable-hard-mode': SS.enableHardMode }">
        <div class='guess-list'>
            <guess-word v-for="row in 6" :letterRowArrayProp="SS.letterGrid[row - 1]" :myRowProp="row - 1" :key='row'>
            </guess-word>
        </div>
        <div class='status-area'>
            <h3 class='status status-game-loading'> Loading ...</h3>
            <h3 class='status status-game-in-progress'> {{ SS.statusMessage }}</h3>
            <h3 class='status status-game-lost'>Sorry, the answer is {{ SS.answer }}</h3>
            <h3 class='status status-game-won'>Congratulations, you got it! Please hire me!</h3>
        </div>

        <keyboard :class="{ enable_delete: (SS.cursorColumn >= 1), enable_enter: (SS.cursorColumn >= 5), }" />
    </div>
</template>

<script lang='ts'>
"use strict";
// @ts-check

import Keyboard from '@/components/Keyboard.vue'
import Vue from 'vue'
import GuessWord from './GuessWord.vue'
import {
    EventNames, EventHandler, WordLoadedEvt, GameOverEvt,
    GamePlayStates, KeyCodes, MatchCodes, LetterColorPair, ILetterColorPair, KBRawKeyClickEvt,
    RequestWordLoadEvt,
    SetKeyColorEvt,
} from '@/types'
import EventBus from '@/EventBus'
import SharedState, { resetSharedState, statusMsg, } from '@/SharedState'
import WordlessApiService from '@/WordlessApiMock'

export default Vue.extend({
    name: 'game-container',
    data() {
        return {};
    },
    components: { GuessWord, Keyboard },
    computed: {
        SS: SharedState,
        cursorWordArray(): LetterColorPair[] { return this.SS.letterGrid[this.SS.cursorRow]; },
    },
    mounted() {
        EventBus.On(EventNames.WORD_LOADED, this.onWordLoaded.bind(this) as EventHandler);
        EventBus.On(EventNames.TRIGGER_WORD_LOAD, this.onTriggerWordLoad.bind(this) as EventHandler);
        EventBus.On(EventNames.KB_RAWKEY, this.keyEventHandler.bind(this) as EventHandler);
    },

    methods: {
        scoreGuessLetter(guessLetter: string, cursorColumn?: number): ILetterColorPair {
            const color = (guessLetter === this.SS.answer.charAt(cursorColumn ?? this.SS.cursorColumn)) ? MatchCodes.CORRECT : (this.SS.answer.includes(guessLetter) ? MatchCodes.ELSEWHERE : MatchCodes.MISS);
            return { color: color, letter: guessLetter } as LetterColorPair;
        },
        setKeyColorsFromCursorRow() {
            this.cursorWordArray.forEach((pair: LetterColorPair) => {
                EventBus.emit(EventNames.SET_KEY_COLOR, { key: pair.letter, color: pair.color } as SetKeyColorEvt);
            });
        },
        onWordLoaded(evt: WordLoadedEvt) {
            resetSharedState();
            EventBus.emit(EventNames.SET_KEY_COLOR, { key: '*', color: MatchCodes.DEFAULT } as SetKeyColorEvt);
            this.SS.answer = evt.word.toUpperCase();
            this.SS.gamePlayState = GamePlayStates.PLAYING;
            statusMsg('Guess the 5-letter word in 6 tries. Good luck!');
        },
        // tslint:disable no-unused-vars
        async onTriggerWordLoad(_evt: RequestWordLoadEvt) {
            console.log("onTriggerWordLoad");
            const response = await WordlessApiService.getWordAsync();
            console.log("onTriggerWordLoad: got ", response);
            if (response.success) {
                this.SS.apiVersion = response.apiVersion ?? 'n/a';
                EventBus.emit(EventNames.WORD_LOADED, { word: response.word } as WordLoadedEvt);
            }
            else {
                statusMsg(`Error loading word - ${response.message}. Refresh page to retry.`);
            }
        },
        async keyEventHandler(eventArgs: KBRawKeyClickEvt): Promise<void> {
            const letter = eventArgs.key;

            statusMsg('');
            const nLettersTyped = this.SS.cursorColumn;

            switch (true) {
                case letter === KeyCodes.ENTER && nLettersTyped >= 5:
                    await this.validateAndAcceptWord();
                    break;
                case letter === KeyCodes.DELETE && nLettersTyped > 0:
                    this.$set(this.cursorWordArray, --this.SS.cursorColumn, LetterColorPair.empty());
                    break;
                case letter.length === 1 && letter >= 'A' && letter <= 'Z' && nLettersTyped < 5:
                    this.$set(this.cursorWordArray, this.SS.cursorColumn++, this.scoreGuessLetter(letter, this.SS.cursorColumn));
                    break;
                default:
                    return;
            }
        },
        async validateAndAcceptWord() {
            const completedGuessWord = this.cursorWordArray.reduce((acc: string, lcPair: LetterColorPair) => acc + lcPair.letter, '');
            const resp = await WordlessApiService.checkWordAsync(completedGuessWord);
            switch (resp.exists) {
                case false:
                    // word is NOT a dictionary word.  Keep editing this word.
                    if (completedGuessWord === "XYZZY") {
                        statusMsg(`( ${this.SS.answer} is the answer :)`);
                    }
                    else {
                        statusMsg(`Sorry, ${completedGuessWord} is not in my dictionary!`);
                    }

                    // erase the last letter and moe cursor back onto screen to make the word editable again
                    this.$set(this.cursorWordArray, --this.SS.cursorColumn, LetterColorPair.empty());
                    break;
                case true:
                    // Word is valid.  Process the accepted guethis.
                    this.SS.guessList.push(completedGuessWord);
                    this.setKeyColorsFromCursorRow();

                    // Move to next row (this triggers the css reveal of the row colors) and resets cursor back to start
                    this.SS.cursorColumn = 0;
                    this.SS.cursorRow++;

                    // see if we've won or lost.  
                    // Guesses is a 1-based count, so already-incremented S.guessNumber (0-5 playing, 6 if we've lost) is the 1-6 we want.
                    if (completedGuessWord === this.SS.answer) {
                        this.SS.gamePlayState = GamePlayStates.WON;
                        EventBus.emit(EventNames.GAME_OVER, { won: true, guesses: this.SS.cursorRow } as GameOverEvt);
                    }
                    else if (this.SS.cursorRow >= 6) {
                        this.SS.gamePlayState = GamePlayStates.LOST;
                        EventBus.emit(EventNames.GAME_OVER, { won: false, guesses: this.SS.cursorRow } as GameOverEvt);
                    }
                    else
                        await this.displayMatchingWordCount(this.SS.answer, this.SS.guessList);

                    break;
                case undefined:
                    statusMsg(`Error validating word: ${resp.message}. Try again in a few moments.`);
                    break;
            }
        },
        async displayMatchingWordCount(answer: string, guesses: string[]): Promise<void> {
            const resp = await WordlessApiService.getMatchCountAsync(answer, guesses);
            console.log("displayMatchingWordCount", answer, guesses, resp,);
            if (!resp.success) {
                statusMsg(`Failed to calc remaining: ${resp.message}`);
            } else {
                statusMsg(`${resp.count} remaining word(s) match the clues above.`);
            }
        },
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

.status-area {
    min-height: 20px;
    margin-top: 10px;
}

.status {
    font-size: var(--status-font-size);
    transform: scale(0, 0);
    display: none;
    margin: 0;
    height: 0;
}

.gamestate-loading .status-game-loading,
.gamestate-playing .status-game-in-progress,
.gamestate-won .status-game-won,
.gamestate-lost .status-game-lost {
    transform: scale(1, 1);
    display: block;
}
</style>