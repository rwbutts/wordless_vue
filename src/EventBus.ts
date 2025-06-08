"use strict";
// @ts-check

import mitt, { Emitter } from "mitt";

import {
    EventNames,
    EventHandler,
    RequestWordLoadEvt,
    PlainObject,
    BaseEvt,
} from "@/types";

export class EventBus {
    static readonly DEFAULT_EVENT_NAME = "DEFAULT";

    _emitter: Emitter<BaseEvt> = mitt<BaseEvt>();

    emit(
        eventName: string,
        eventArgument: PlainObject,
        sender?: PlainObject,
        delayMS: number | false = false
    ): void {
        const _eventArgument =
            sender !== undefined
                ? Object.assign({ _sender: sender }, eventArgument)
                : eventArgument;
        if (delayMS === false) {
            this._emitter.emit(eventName, _eventArgument);
        } else {
            setTimeout(
                (This: InstanceType<typeof EventBus>) =>
                    This._emitter.emit(eventName, _eventArgument),
                delayMS,
                this
            );
        }
    }

    On(event: string, handler: EventHandler): EventHandler {
        this._emitter.on(event, handler);
        return handler;
    }

    Off(event: string, handler: EventHandler): void {
        this._emitter.off(event, handler);
    }

    emitTriggerWordLoadEvent(): void {
        this.emit(EventNames.TRIGGER_WORD_LOAD, {} as RequestWordLoadEvt);
    }
}

const defaultEventBus = new EventBus();
export default defaultEventBus;
