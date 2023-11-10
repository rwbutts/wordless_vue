"use strict";
// @ts-check

import Vue from 'vue'
import { CustomEventNames, GameStates, MatchCodes, KeyCodes, } from '@/types';



export class EventArgsBase
{
     // must override in derived class
     _defaultEventName? :string;

     constructor( defaultEventName? :string)
     {
          this._defaultEventName = defaultEventName;
     }

     static create()
     {
          return Reflect.construct(this, arguments);
     }

     emit()
     {
          if(!this._defaultEventName )
               throw new Error('EventArgsBase() emit called with no default name set in subclass');
          
          EventBus.emit( this, this._defaultEventName ); 
     }
}

export class EventBus
{
     static _emitterComponent : Vue;

     constructor ( )
     {
     }

     static _verifyEventNameNotNull( name : string) :void
     {
          if( name === null )
          {
               throw new Error("Null event name was attempted");
          }
     }
     
     static get eventSource() : Vue
     {
          if( !this._emitterComponent )
               this._emitterComponent = new Vue();

          return this._emitterComponent;
     }

     static emit( eventArgument : {}|string, eventName: string )
     {
          console.log('EventBus::emit',eventName,eventArgument); 
          this._verifyEventNameNotNull( eventName );
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

     static startListen( handler:(arg:any)=>void, eventName: string )
     {
          this._verifyEventNameNotNull( eventName );
          this.eventSource.$on( eventName, handler );

     }

     static stopListen( handler:(arg:any)=>void, eventName: string  )
     {
          this._verifyEventNameNotNull( eventName );
          this.eventSource.$off( eventName, handler );
     }
}

