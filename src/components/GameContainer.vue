<template>
    <div id="app" class='disable-tap-zoom' :class="{ 'modal-active': statModalIsActive }">
        <stats :isActive.sync='statModalIsActive' ref='stats'/>
        <div class='app-container'>
            <h3 class='title'>Bill's NYTimes <a href='https://www.nytimes.com/games/wordle/index.html'
                    target='_blank'>Wordle</a>&trade; Clone</h3>
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

                <line-edit  :editWord.sync="editWord" @validated="onValidated" @message="statusMsg" @key="statusMsg('')" />
            </div>

            <div class='footer'>
                <label class='hard-checkbox small-text'>
                    <input type="checkbox" v-model="enableHardMode">
                    <b>Hard Mode:</b> when checked, grey letters cannot be reused
                </label>
                <br>
                <br>
                <span class='correct'>Green</span>: correct;
                <span class='elsewhere'>Yellow</span>: wrong position;
                <span class='miss'>Grey</span>: not in word
                <br>
                <!-- <span class='small-text'>The unknown word may be plural</span> -->
                <span class='small-text version-info'>
                    app_ver: {{ appVersion }}
                    <span v-if="apiVersion !== ''">, api_ver: {{ apiVersion }} </span>
                </span>
            </div>
        </div>
    </div>

</template>

<script lang='ts'>
/* eslint-disable no-unused-vars */
"use strict";

import Vue from 'vue'
import GuessWord from './GuessWord.vue'
import LineEdit from './LineEdit.vue'
import Stats from './Stats.vue'
import {
    EventNames, EventHandler, GameOverEvt,
    GamePlayStates, MatchCodes, 
    SetKeyColorEvt,
    WordValidatedEvt,
} from '@/types'
import EventBus from '@/EventBus'
import WordlessApiService from '@/WordlessApiMock'

export default Vue.extend({
    name: 'game-container',
    
    data() {
        return {
            guesses: [] as string[],
            editWord : '',
            gamePlayState : GamePlayStates.LOADING_WORD,
            answer: '',
            statModalIsActive: false,
            appVersion: '',
            apiVersion: '',
            statusMessage: 'Loading ...',
            enableHardMode: false,

        };
    },
    components: { GuessWord, LineEdit, Stats, },
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
            switch(true)
            {
                case e.word === this.answer:
                    this.gamePlayState = GamePlayStates.WON;
                    this.onGameOver({ won: true, guesses: this.nGuesses} as GameOverEvt);
                    this
                    break;
                case this.guesses.length >= 6:
                    this.gamePlayState = GamePlayStates.LOST;
                    this.onGameOver({ won: false, guesses: this.nGuesses} as GameOverEvt);
                    break;
                default:
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
        async onTriggerWordLoad() {
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
        onGameOver(e: GameOverEvt) {
            (this.$refs['stats'] as InstanceType<typeof Stats>).onGameOver(e);
        },

    },
});
</script>

<style>
:root {
    --status-font-size: 12px;
    --title-font-size: min(4vw, 25px);
    --footer-font-size: min(3vw, 15px);
    --color-correct: rgb(137, 233, 137);
    --color-elsewhere: rgb(238, 222, 152);
    --color-miss: #AAA;
    --color-default: #FFF;
    --color-status-err: #822;
    --color-status: #000;
    --color-game-background: white;
    --color-title: rgb(23, 170, 23);
    --color-stats-background: white;
    --color-stats-text: #444;
    --color-modal-game-background: white;
    --color-viewport-color: #eee;
}

@media (min-width: 576px) {
    :root {
        --status-font-size: 14px;
    }
}

@media (min-width: 768px) {}
@media (min-width: 992px) {}
@media (min-width: 1200px) {}
@media (min-width: 1400px) {}

html {
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: flex-start;
    background-color: var(--color-viewport-color);
}

div {
    box-sizing: border-box;
}

body {
    margin: 0;
    height: auto;
    width: auto;
}

#app {
    font-family: Arial, sans-serif;
    color: #2c3e50;
    background-color: var(--color-game-background);
    border: 1px solid #aaa;
    box-shadow: 7px 7px #ddd;
    padding: 5px 10px;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    touch-action: 'manipulation';
    /* disable iphone default tap zoom action */
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    position: relative;
    width: auto;
    height: auto;
    margin: 5px 0;
}

.disable-tap-zoom {
    touch-action: none;
    /* disable iphone default tap zoom action */
}

.game-container {
    position: static;
}

.title {
    font-weight: bold;
    font-size: var(--title-font-size);
    color: var(--color-title);
}

span.correct {
    background-color: var(--color-correct);
}

span.elsewhere {
    background-color: var(--color-elsewhere);
}

span.miss {
    background-color: var(--color-miss);
}

.footer {
    font-size: var(--footer-font-size);
    font-weight: bold;
    margin: auto;
}

.small-text {
    font-weight: normal;
    font-size: smaller;
}

.version-info {
    color: #bbb;
}

.hard-checkbox input {
    margin-bottom: 0px;
    height: 2vh;
    width: 2vh;
}

.game-in-progress .guess-row.current>.letter-container {
    border: 3px solid #888;

}

.game-in-progress .guess-row.current>.letter-container.current {
    border: 3px solid #888;
    background-color: #fee;
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