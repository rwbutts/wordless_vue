"use strict";
// @ts-check

import Vue from 'vue'
import mitt, { Emitter } from 'mitt'

import { CustomEventNames, InitializeEventArgs, KeyPressEventArgs, WordLoadedEventArgs, KBCommandEventArgs, EventArgs } from '@/types';

export class EventBus
{
    static readonly DEFAULT_EVENT_NAME = "DEFAULT";

     _emitter : Emitter<EventArgs> = mitt<EventArgs>();

     emit( eventArgument: EventArgs, eventName?: string ) : void
     {
        let event = eventName ?? eventArgument?.event;
        if(event)
            this._emitter.emit( event, eventArgument );
     }

     emitEvent( eventArgument: any, event: string = EventBus.DEFAULT_EVENT_NAME) : void
     {
        if(event)
            this._emitter.emit( event, eventArgument );
     }

     emitNewWord( eventArgument: WordLoadedEventArgs ) : void
     {
          this.emit( eventArgument ); 
     }

     emitKeyPress( eventArgument: KeyPressEventArgs ) : void
     {
          this.emit( eventArgument ); 
     }

     emitInitialize( eventArgument: InitializeEventArgs ) : void
     {
          this.emit( eventArgument ); 
     }

     emitEnableKeySet( eventArgument: KBCommandEventArgs ) : void
     {
          this.emit( eventArgument ); 
     }

     startListen( handler:( arg: any ) => void, eventName: string = EventBus.DEFAULT_EVENT_NAME) : void
     {
            this._emitter.on( eventName, handler );
     }

     stopListen( handler?:( arg: any ) => void, eventName: string = EventBus.DEFAULT_EVENT_NAME) : void 
     {
          this._emitter.off( eventName, handler );
     }
}

const defaultEventBus = new EventBus();
export default defaultEventBus;


