"use strict";
// @ts-check

import Vue from 'vue'
import { CustomEventNames, GameStates, MatchCodes, KeyCodes, } from '@/types';

export class EventBus
{
     static _emitterComponent : Vue;

     static get eventSource() : Vue
     {
          if( !this._emitterComponent )
               this._emitterComponent = new Vue();

          return this._emitterComponent;
     }

     static emit( eventArgument: {}, eventName: string )
     {
          console.log( 'EventBus::emit', eventName, eventArgument); 
          this.eventSource.$emit( eventName, eventArgument );
     }

     static emitResetEvent( eventArgument: ResetGameEventArgs )
     {
          this.emit( eventArgument, CustomEventNames.RESET_COMPONENTS ); 
     }

     static emitResetRequestEvent( eventArgument: ResetKeyEventArgs )
     {
          this.emit( eventArgument, CustomEventNames.RESET_KEY ); 
     }

     static startListen( handler:( arg:any ) => void, eventName: string )
     {
          this.eventSource.$on( eventName, handler );
     }

     static stopListen( handler:( arg:any ) => void, eventName: string )
     {
          this.eventSource.$off( eventName, handler );
     }
}

