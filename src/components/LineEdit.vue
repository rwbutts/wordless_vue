<template>

        <keyboard :class="{ enable_delete: (editWord.length >= 1), enable_enter: (editWord.length >= 5), }" @key="onKey" />

</template>

<script lang='ts'>
"use strict";
// @ts-check
//import SharedState from '@/SharedState'
import Vue, { PropType, } from 'vue'
import Keyboard from './Keyboard.vue'
import { KBRawKeyClickEvt,  WordValidatedEvt, KeyCodes, } from '@/types'
import WordlessApiService, {  } from '@/WordlessApiMock'

export default Vue.extend({
    name: 'line-edit',

    data() {
        return {
            cursorColumn: 0,
        };
    },
    components: { Keyboard, },
    props: {
        editWord: {
            type: String as PropType<string>,
        },
    },
    methods:
    {
        async onKey(e: KBRawKeyClickEvt): Promise<void> {
            const key = e.key;
            this.$emit('key', e);

            const L = this.editWord.length;
            let newEditWord = this.editWord;

            switch (true) {
                case key === KeyCodes.ENTER && L >= 5:
                    {
                        const resp = await WordlessApiService.checkWordAsync(this.editWord);
                        switch (resp.exists) {
                            case false:
                                this.statusMsg(`Sorry, ${this.editWord} is not in my dictionary!`);
                                newEditWord = this.editWord.substring(0, L - 1);
                                break;
                            case true:
                                // Word is valid.  Process the accepted guethis.
                                this.$emit('validated', { word: this.editWord } as WordValidatedEvt);
                                newEditWord = '';
                                break;
                            case undefined:
                                this.statusMsg(`Error validating word: ${resp.message}. Try again in a few moments.`);
                                break;
                        }
                    }
                    break;
                case key === KeyCodes.DELETE && L > 0:
                    newEditWord = this.editWord.substring(0, L - 1);
                    break;
                case key.length === 1 && key >= 'A' && key <= 'Z' && L < 5:
                    newEditWord += key;
                    break;
            }

            if(newEditWord !== this.editWord)
            {
                this.$emit('update:editWord', newEditWord);
            }

        },
        statusMsg( msg: string ) {
            this.$emit('message', msg );
        },
    },
    // mounted() {
    //     EventBus.On(EventNames.SET_KEY_COLOR, this.onSetKeyColor.bind(this) as EventHandler);
    //     window.addEventListener('keydown', this.handleKeyboardKey.bind(this));
    // },

});
</script>

<style>
</style>
