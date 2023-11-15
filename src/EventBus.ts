"use strict";
// @ts-check

import Vue from 'vue'
import { CustomEventNames,  } from '@/types';

export class EventBus
{
     static _emitterComponent : Vue;

     static get eventSource() : Vue
     {
          if( !this._emitterComponent )
               this._emitterComponent = new Vue();

          return this._emitterComponent;
     }

     static emit( eventArgument: unknown, eventName: string ) : void
     {
          console.log( 'EventBus::emit', eventName, eventArgument); 
          this.eventSource.$emit( eventName, eventArgument );
     }

     static emitResetEvent( eventArgument: ResetGameEventArgs ) : void
     {
          this.emit( eventArgument, CustomEventNames.RESET_COMPONENTS ); 
     }

     static emitResetRequestEvent( eventArgument: ResetKeyEventArgs ) : void
     {
          this.emit( eventArgument, CustomEventNames.RESET_KEY ); 
     }

     static startListen( handler:( arg: unknown ) => void, eventName: string ) : void
     {
          this.eventSource.$on( eventName, handler );
     }

     static stopListen( handler:( arg: unknown ) => void, eventName: string ) : void 
     {
          this.eventSource.$off( eventName, handler );
     }
}

