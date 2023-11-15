"use strict";
// @ts-check

export function assert( condition: boolean, message = '' ) : void
{
     if (!condition) {
         throw new Error( 'assert() failed: ' + message );
     }
 }
