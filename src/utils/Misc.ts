"use strict";
// @ts-check

export function assert( condition: boolean, message:string = '' ) {
     if (!condition) {
         throw new Error( 'assert() failed: ' + message );
     }
 }
