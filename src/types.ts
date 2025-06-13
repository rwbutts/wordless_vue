export type PlainObject = Record<string, unknown>;
export type EventHandler<T = unknown> = (event: T) => void;
export const enum EventNames {
    SET_KEY_COLOR = "set_key_color",
}

export type BaseEvt = Record<string, unknown>;
export interface GameOverEvt extends BaseEvt {
    won: boolean;
    guesses: number;
}
export interface KBRawKeyClickEvt extends BaseEvt {
    key: string;
}

export interface WordValidatedEvt extends BaseEvt {
    word: string;
}
export interface SetKeyColorEvt extends BaseEvt {
    key: string;
    color: MatchCodes;
}

export const enum GamePlayStates {
    LOADING_WORD = "gamestate-loading",
    PLAYING = "gamestate-playing",
    WON = "gamestate-won",
    LOST = "gamestate-lost",
}

export const enum MatchCodes {
    DEFAULT = "default",
    MISS = "miss",
    ELSEWHERE = "elsewhere",
    CORRECT = "correct",
}

export const enum KeyCodes {
    ENTER = "ENTER",
    DELETE = "DELETE",
    ALPHA = "ALPHA",
    NONALPHA = "SPECIAL",
    ALL = "*",
    RESET = "RESET",
}
