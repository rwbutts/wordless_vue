<template>

    <BUTTON href='#' class='key-button' @click="clickHandler"
        :class="{ [color]: true, [keyNameClass]: true, 'key-down': keyDown, enabled: enabled }">
        {{ label ? label : char }}
    </BUTTON>

</template>

<script lang='ts'>
"use strict";
// @ts-check
//import SharedState from '@/SharedState'
import Vue, { PropType, } from 'vue'
import { EventNames, KBRawKeyClickEvt, MatchCodes, WordLoadedEvt, } from '@/types';
import EventBus from '../EventBus';

export default Vue.extend({
    name: 'key',

    data() {
        return {
            keyDown: false,
            color: MatchCodes.DEFAULT,
            enabled: false,
        };
    },

    props: {
        label: {
            type: String as PropType<string>,
            default: "",
        },

        control_key: {
            type: Boolean as PropType<boolean>,
            default: false,
        },

        char: {
            type: String as PropType<string>,
            required: true,
        },
    },

    computed:
    {
        keyNameClass():string {
            return 'key-'+this.char.toLowerCase();
        },
    },

    methods:
    {
        clickHandler(): void {
            /**                
             * check if disabled in css so keypress-
             * calls are ignored (native click will be 
             * disabled by css setting natively.)
             **/
            if ('none' !== window.getComputedStyle(this.$el).getPropertyValue('pointer-events')) {
                this.keyDown = true;
                EventBus.emit(EventNames.KB_RAWKEY, {key: this.char } as KBRawKeyClickEvt);
                setTimeout(() => (this.keyDown = false), 100);
            }
        },
        handleKeyboardKey(e: KeyboardEvent): void {
            if ((e.key || '').toUpperCase() === this.char) {
                this.clickHandler();
            };
        },
        setColor(color: MatchCodes = MatchCodes.DEFAULT) {
            this.color = color;
        },
        onWordLoaded(evt: WordLoadedEvt) {
            this.setColor();
        },
    },

    mounted() {
        EventBus.On({ event: EventNames.WORD_LOADED, handler: this.onWordLoaded, This: this })
        window.addEventListener('keydown', this.handleKeyboardKey.bind(this));
    },

});
</script>

<style>
button.key-button,
.modal-active.modal-active.modal-active button.key-button {
    --key-width: min(7vw, 30px);
    display: inline-block;
    border: 2px solid grey;
    border-radius: 5px;
    padding: 0px 4px;
    margin: 0 calc(var(--key-width) * .1);
    min-width: var(--key-width);
    height: calc(var(--key-width) * .8);
    font-size: calc(var(--key-width) * .5);
    font-weight: normal;
    color: black;

    opacity: .4;
    pointer-events: none;
}

button.key-button:active {
    border: 2px solid black;

}

button.key-button.enabled,
.game-in-progress .keyboard.guess-is-not-empty .key-backspace,
.game-in-progress .keyboard.guess-is-full-word .key-enter,
.game-in-progress .keyboard.guess-is-not-full-word .key-alpha,
.game-over .key-reset {
    opacity: 1.0;
    pointer-events: all;
}

.key-button.default {
    background-color: var(--color-default);
}

.key-button.miss {
    background-color: var(--color-miss);
}

.key-button.elsewhere {
    background-color: var(--color-elsewhere);
}

.key-button.correct {
    background-color: var(--color-correct);
}

/* 
     key down immediately makes dark, when down is removed, 
     fade back to normal
*/
.key-button {
    transition: all .2s 0s;
}

.key-button.key-down {
    color: white;
    background-color: #444;
    transition: all 0s 0s;
}

/*   if expert mode, disable the key if it's a miss.
     duplicate .miss to increase priority of selector 
*/
.enable-hard-mode .key-button.miss.miss {
    opacity: .4;
    pointer-events: none;
}
</style>

<style scoped></style>
