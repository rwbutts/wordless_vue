"use strict";
// @ts-check

import Vue from "vue";
import mitt, { Emitter } from "mitt";

//import { CustomEventNames, InitializeEventArgs, KeyPressEventArgs, WordLoadedEventArgs, KBCommandEventArgs, EventArgs,
//    EvtReceiver,  } from '@/types';
import {
    EventNames,
    WordLoadedEvt,
    GuessAcceptedEvt,
    EvtHandler,
    KBRawKeyClickEvt,
    RequestWordLoadEvt,
    BaseEvt,
    PlainObject,
} from "@/types";

export class EventBus {
    static readonly DEFAULT_EVENT_NAME = "DEFAULT";

    _emitter: Emitter<BaseEvt> = mitt<BaseEvt>();

    emit(eventName: string, eventArgument: any, sender?: any, delayMS: number=0): void {
        let _eventArgument =
            sender !== undefined
                ? Object.assign({ _sender: sender }, eventArgument)
                : eventArgument;
        if( !delayMS ) {
            this._emitter.emit(eventName, _eventArgument);
        }else{
            setTimeout(()=>this._emitter.emit(eventName, _eventArgument), delayMS);
        }
    }

    //On(receivers: EvtHandler | EvtHandler[]): EvtHandler | EvtHandler[] {
    On<T extends EvtHandler|EvtHandler[]>(receivers: T): T {
        if (Array.isArray(receivers)) {
            receivers.forEach((r) =>
                this._emitter.on(
                    r.event,
                    r.This
                        ? (r._boundHandler = r.handler.bind(r.This))
                        : r.handler
                )
            );
        } else {
            this._emitter.on(
                receivers.event,
                receivers.This
                    ? (receivers._boundHandler = receivers.handler.bind(
                          receivers.This
                      ))
                    : receivers.handler
            );
        }
        return receivers;
    }

    Off(receivers: EvtHandler | EvtHandler[]) {
        if (Array.isArray(receivers)) {
            receivers.forEach((r) =>
                this._emitter.off(
                    r.event,
                    r._boundHandler ? r._boundHandler : r.handler
                )
            );
        } else {
            this._emitter.off(
                receivers.event,
                receivers._boundHandler
                    ? receivers._boundHandler
                    : receivers.handler
            );
        }
    }

    emitTriggerWordLoadEvent() {
        this.emit( EventNames.TRIGGER_WORD_LOAD, {} as RequestWordLoadEvt);
    }
}

const defaultEventBus = new EventBus();
export default defaultEventBus;
