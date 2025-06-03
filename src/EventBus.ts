"use strict";
// @ts-check

import Vue from "vue";
import mitt, { Emitter } from "mitt";

//import { CustomEventNames, InitializeEventArgs, KeyPressEventArgs, WordLoadedEventArgs, KBCommandEventArgs, EventArgs,
//    EvtReceiver,  } from '@/types';
import {
    EventNames,
    KBKeyStyleEvt,
    WordLoadedEvt,
    GuessAcceptedEvt,
    EvtHandler,
    KBRawKeyClickEvt,
    RequestWordLoadEvt,
    BaseEvt,
    PlainObject,
} from "@/types2";

export class EventBus {
    static readonly DEFAULT_EVENT_NAME = "DEFAULT";

    _emitter: Emitter<BaseEvt> = mitt<BaseEvt>();

    emit(eventName: string, eventArgument: any, sender?: any): void {
        let _eventArgument =
            sender !== undefined
                ? Object.assign({ _sender: sender }, eventArgument)
                : eventArgument;
        this._emitter.emit(eventName, _eventArgument);
    }

    On(receivers: EvtHandler | EvtHandler[]) {
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
}

const defaultEventBus = new EventBus();
export default defaultEventBus;
