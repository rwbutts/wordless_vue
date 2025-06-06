<template>

    <div class='stat-box' :class='{ showdialog: showDialog }'>
        <h1 class='title'>Cumulative Statistics</h1>
        <h2 class='subtitle'>Words Guessed</h2>
        <statbar class='bar-guessed-pct' :percent="winPct" :caption="cumStats.gamesWon.toString()" />

        <h2>Guesses Required</h2>
        <statbar class='bar-guesses-required' v-for="i in 6" :percent="histogramPct(i)" :caption="i.toString()"
            :key="i" />

        <h2 class='subtitle'>Words Missed</h2>
        <statbar class='bar-missed-pct' :percent="lossPct"
            :caption="(cumStats.gamesPlayed - cumStats.gamesWon).toString()" />

        <h2 class='subtitle'>Winning streak: {{ cumStats.winningStreak }} in a row</h2>

        <div class='close-button'>
            <!-- <a @click="Hide();">&#x2716;</a> -->
            <button class='key-button enabled' @click="closeDialog();" @keyup.enter="closeDialog">
                Close
            </button>
        </div>
    </div>

</template>

<script lang='ts'>
"use strict";
// @ts-check

import Vue, { PropType } from 'vue'
import StatBar from './StatBar.vue'
import CumulativeStats from '@/CumulativeStats'
import { assert } from '@/utils/Misc';
import { EventNames, GameOverEvt, EvtHandler } from '@/types'
import EventBus from '@/EventBus';

export default Vue.extend({
    name: 'statbox',

    data() {
        return {
            cumStats: new CumulativeStats(),
            showDialog: false,
            _eventHandler: undefined as EvtHandler | undefined,
        };
    },

    components: {
        statbar: StatBar,
    },

    props: {
        isActive: {
            type: Boolean as PropType<boolean>,
            required: true,
        }
    },

    watch: {
    },

    methods: {
        histogramPct(NTries: number): number {
            return Math.floor((this.cumStats.histogramBins[NTries - 1] / this.cumStats.gamesWon) * 100 + 0.5);
        },

        closeDialog(): void {
            this.showDialog = false;
            this.$emit('update:isActive', false);
        },

        handleKey(e: KeyboardEvent) {
            if (this.showDialog && (e.key === 'Enter' || e.key === 'Escape'))
                this.closeDialog();
        },
        onGameOver(evt: GameOverEvt) {
            let newStats;
            if (evt.won) {
                assert(!(evt.guesses === undefined), 'newVal.numGuesses is not undefined');
                newStats = CumulativeStats.recordWin(evt.guesses as number);
            }
            else {
                newStats = CumulativeStats.recordLoss();
            }

            this.cumStats = Object.assign({}, this.cumStats, newStats);
            this.$emit('update:isActive', true);

            this.showDialog = true;
        },
    },
    computed: {
        winPct: function (): number {
            return Math.floor((this.cumStats.gamesWon / this.cumStats.gamesPlayed) * 100 + 0.5);
        },

        lossPct: function (): number {
            return Math.floor(((this.cumStats.gamesPlayed - this.cumStats.gamesWon) / this.cumStats.gamesPlayed) * 100 + 0.5);
        }
    },

    mounted() {
        this.handleKey = this.handleKey.bind(this);
        window.addEventListener('keydown', this.handleKey);
        this._eventHandler = EventBus.On({ event: EventNames.GAME_OVER, handler: this.onGameOver, This: this } as EvtHandler);
    },
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.stat-box.showdialog {
    display: block;
    visibility: visible;
    transform: scale(1, 1);
    transition: transform .25s linear 4s;
}

.stat-box {
    display: block;
    border: 2px solid #777;
    border-radius: 15px;
    width: auto;
    height: auto;
    position: absolute;
    background-color: var(--color-stats-background);
    color: var(--color-stats-text);
    padding: 5px;
    transform: scale(0, 0);
    visibility: hidden;
    z-index: 1;
}

.close-button {
    display: flex;
    justify-content: center;
    margin: 15px 0 5px 0;
}

.close-button button:hover {
    cursor: pointer;
    border-color: #444;
}

h1 {
    font-size: larger;
    margin: 10px 0;
}

h2 {
    font-size: large;
    margin: 25px 0 7px 0;
}
</style>

<style>
div.stat-box.showdialog+div.game-container {
    opacity: 0.2;
    transition: all .4s linear 4s;
    background-color: var(--color-modal-game-background);
}
</style>
