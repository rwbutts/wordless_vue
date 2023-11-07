"use strict";

export function assert( condition: boolean, message:string = '' ) {
     if (!condition) {
         throw new Error(message || "Assertion failed");
     }
 }

 /*
export const MatchCodes = { 
     CORRECT : "correct",
     ELSEWHERE : "elsewhere",
     MISS : "miss",
     DEFAULT : "default",
};
*/



 

