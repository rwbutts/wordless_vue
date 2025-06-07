<template>

    <div id="app" class='disable-tap-zoom'>
        <stats :isActive.sync='SS.statModalIsActive' />
        <div class='game-container disable-tap-zoom' :class="{ [SS.gamePlayState]: true, 'enable-hard-mode': SS.enableHardMode }" >
          <h3 class='title'>Bill's NYTimes <a href='https://www.nytimes.com/games/wordle/index.html' target='_blank'>Wordle</a>&trade; Clone</h3>
          <guess-list  />
            <div class='footer'>
                <label class='hard-checkbox small-text'>
                    <input type="checkbox" v-model="SS.enableHardMode">
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
                    app_ver: {{ SS.appVersion }}
                    <span v-if="SS.apiVersion !== ''">, api_ver: {{ SS.apiVersion }} </span>
                </span>
            </div>
        </div>
    </div>

</template>

<script lang='ts'>
"use strict";
// @ts-check

import Vue from 'vue'
import GuessList from '@/components/GuessList.vue'
import Stats from '@/components/Stats.vue'
import SharedState from './SharedState'


export default Vue.extend({
    name: 'App',

    data() {
        return {
        };
    },

    components: {
        GuessList, Stats, 
    },

    computed: {
        SS:SharedState,
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
    --color-modal-game-background: #white;
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

.game-container.modal-active {
    pointer-events: none;
}
</style>

<style scoped>
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
    height: 1.5vh;
    width: 1.5vh;
}
</style>

<style>


/*
.gg { border: 1px solid green!important;}
.gr { border: 1px solid red!important;}
.gb { border: 1px solid blue!important;}
.gy { border: 1px solid yellow!important;}
*/
</style>
