<template>
    <div class='game-container disable-tap-zoom'
        :class="{ [gamePlayState]: true, 'enable-hard-mode': enableHardMode }">
        <div class='guess-list'>
            <guess-word v-for="row  in 6" :key="row" :wordProp="rowWord(row)" :answerProp="answer" :myRowProp="row - 1" :activeRowProp='nGuesses'>
            </guess-word>
        </div>
        <div class='status-area'>
            <h3 class='status status-game-loading'> Loading ...</h3>
            <h3 class='status status-game-in-progress'> {{ statusMessage }}</h3>
            <h3 class='status status-game-lost'>Sorry, the answer is {{ answer }}</h3>
            <h3 class='status status-game-won'>Congratulations, you got it! Please hire me!</h3>
        </div>

        <line-edit  :editWord.sync="editWord" @validated="onValidated" @message="statusMsg" @key="statusMsg('')"/>
    </div>
</template>

<script lang='ts'>
"use strict";
// @ts-check

import Vue from 'vue'
import GuessWord from './GuessWord.vue'
import LineEdit from './LineEdit.vue'
import {
    EventNames, EventHandler, GameOverEvt,
    GamePlayStates, MatchCodes, 
    RequestWordLoadEvt,
    SetKeyColorEvt,
    WordValidatedEvt,
} from '@/types'
import EventBus from '@/EventBus'
import WordlessApiService from '@/WordlessApiMock'

export default Vue.extend({
    name: 'game-container',
    props: {
        'enableHardMode': {
            type: Boolean,
            required: true,
        },
    },

    data() {
        return {
            guesses: [] as string[],
            editWord : '',
            gamePlayState : GamePlayStates.LOADING_WORD,
            answer: '',
            statusMessage: 'Loading ...',
        };
    },
    components: { GuessWord, LineEdit, },
    computed: {
        nGuesses(): number {
            return this.guesses.length;
        },
    },
    mounted() {
        EventBus.On(EventNames.TRIGGER_WORD_LOAD, this.onTriggerWordLoad.bind(this) as EventHandler);
    },

    methods: {
        statusMsg( msg: string) {
            this.statusMessage = msg;
        },
        rowWord( row: number ): string {
            if( row -1 === this.nGuesses) {
                return this.editWord;
            } else if( row-1 < this.nGuesses ) {
                return this.guesses[row-1];
            } else {
                return '';
            }
        },
        async onValidated(e: WordValidatedEvt) {
            this.guesses.push(e.word);
            this.setKeyColorsFromGuess(e.word);
            if( e.word === this.answer ) {
                this.gamePlayState = GamePlayStates.WON;
                this.$emit('gameover', { won: true, guesses: this.nGuesses} as GameOverEvt);
            } else if( this.guesses.length >=6 ) {
                this.gamePlayState = GamePlayStates.LOST;
                this.$emit('gameover', { won: false, guesses: this.nGuesses} as GameOverEvt);
            } else {
                await this.displayMatchingWordCount(this.answer, this.guesses);
            }
        },
        setKeyColorsFromGuess( guess: string) {
            for(let i=0; i<guess.length; i++ ) {
                const gc = guess.charAt(i);
                const color = (gc === this.answer.charAt(i)) ? MatchCodes.CORRECT : (this.answer.includes(gc) ? MatchCodes.ELSEWHERE : MatchCodes.MISS);
                EventBus.emit(EventNames.SET_KEY_COLOR, { key: gc, color: color } as SetKeyColorEvt);
            }
        },
        resetState() {
                this.guesses = [];
                EventBus.emit(EventNames.SET_KEY_COLOR, { key: '*', color: MatchCodes.DEFAULT } as SetKeyColorEvt);
                this.gamePlayState = GamePlayStates.PLAYING;
        },
        // @typescript-eslint-disable-next-line no-unused-vars
        async onTriggerWordLoad(_evt: RequestWordLoadEvt) {
            this.statusMsg("Loading ...");
            const response = await WordlessApiService.getWordAsync();
            console.log("onTriggerWordLoad: got ", response);
            if ( response.success) {
                this.answer = response.word?.toUpperCase() as string;
                this.resetState();
                this.statusMsg('Guess the 5-letter word in 6 tries. Good luck!');
            }
            else {
                this.statusMsg(`Error loading word - ${response.message}. Refresh page to retry.`);
            }
        },
        async displayMatchingWordCount(answer: string, guesses: string[]): Promise<void> {
            const resp = await WordlessApiService.getMatchCountAsync(answer, guesses);
            //console.log("displayMatchingWordCount", answer, guesses, resp,);
            if (!resp.success) {
                this.statusMsg(`Failed to calc remaining: ${resp.message}`);
            } else {
                this.statusMsg(`${resp.count} remaining word(s) match the clues above.`);
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