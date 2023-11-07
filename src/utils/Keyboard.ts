"use strict";
/* eslint-disable no-unused-vars */

import { CustomEventNames, EventArgsBase, } from '@/EventBus'



export const KeyCodes: ObjStringMap<string|string[]>  = {
     ENTER : "ENTER",
     DELETE : "BACKSPACE",
     LETTER : "LETTER",
     ALL : "ALL",
     NONALPHA: ['ENTER','BACKSPACE'],
     RESET:'RESET'
};

export class KeyPressEventArgs extends EventArgsBase
{
     character: string;

     constructor( character: string )
     {
          super( CustomEventNames.KEYPRESS );
          this.character = character;
     }
}
