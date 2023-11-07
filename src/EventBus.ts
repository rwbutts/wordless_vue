"use strict";
import Vue from 'vue'

   
export const CustomEventNames: ObjStringMap<string> = {
     RESET_KEY : 'user-reset-key',
     RESET_COMPONENTS: "init-components",
     SETKEYSTYLE : 'set-key-style',
     KEYPRESS: 'key-press',
}

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


export class ResetGameEventArgs extends EventArgsBase
{
     answer : string;
     
     constructor( answer: string )
     {
          super( CustomEventNames.RESET_COMPONENTS );
          this.answer = answer;
     }
}

