<template>

    <BUTTON href='#' class='key-button' @click="clickHandler"
        :class="{ [color]: true, [keyNameClass]: true, [controlKey?'nonalpha':'alpha']: true, 'key-down': keyDown,  }">
        {{ label ? label : char }}
    </BUTTON>

</template>

<script lang='ts'>
"use strict";
// @ts-check
//import SharedState from '@/SharedState'
import Vue, { PropType, } from 'vue'
import { EventNames, KBRawKeyClickEvt, MatchCodes, WordLoadedEvt, EventHandler, SetKeyColorEvt, } from '@/types';
import EventBus, {  } from '../EventBus';

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

        controlKey: {
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
                this.$emit('click', {key: this.char });
                setTimeout(() => (this.keyDown = false), 100);
            }
        },
        handleKeyboardKey(e: KeyboardEvent): void {
            let keyTranslated = e.key==='Backspace' ? 'DELETE': e.key.toUpperCase();
            if (keyTranslated  === this.char) {
                this.clickHandler();
            }
        },
        
        onSetKeyColor(evt: SetKeyColorEvt) {
            if( evt.key==='*' || evt.key==this.char || evt.key==='alpha' && !this.controlKey || evt.key==='nonalpha' && this.controlKey)
            {
                if( evt.key ==='*' || evt.color === MatchCodes.DEFAULT || this.color != MatchCodes.CORRECT )
                {
                    this.color = evt.color;
                }
            }
        }
    },

    mounted() {
        EventBus.On(EventNames.SET_KEY_COLOR, this.onSetKeyColor.bind(this) as EventHandler);
        window.addEventListener('keydown', this.handleKeyboardKey.bind(this));
    },

});
</script>

<style>
/*
default styles for the keyboard keys and the modal close buttons.
*/
button.key-button, button.close-button {
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
}

/* keys diabled by default, enabled selectively below */
button.key-button, .modal-active.modal-active.modal-active button.key-button {
    opacity: .4;
    pointer-events: none;
}

button.key-button:active {
    border: 2px solid black;

}

/* 
enable keys at desired times, baed on game state,
and the position of the cursor in the edited line.
*/
.gamestate-playing .keyboard.enable_delete .key-delete,
.gamestate-playing .keyboard.enable_enter .key-enter,
.gamestate-playing .keyboard:not(.enable_enter) .alpha,
.gamestate-won .key-reset, .gamestate-lost .key-reset {
    opacity: 1.0;
    pointer-events: all;
}

/* handle key color values */
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
     Duplicate .miss to increase priority of selector 
*/
.enable-hard-mode .key-button.miss.miss {
    opacity: .6;
    pointer-events: none;
}
</style>
