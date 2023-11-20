"use strict";
// @ts-check

const STAT_STORAGE_NAME = 'cumulative_stats';

export default class CumulativeStats
{
     gamesPlayed: number;
     winningStreak: number;
     gamesWon: number;
     histogramBins: number[];

     constructor()
     {
          this.gamesPlayed = 0;
          this.winningStreak = 0;
          this.gamesWon = 0;
          this.histogramBins = [ 0, 0, 0, 0, 0, 0 ];
     
     }

     static recordWin( numGuesses : number ) : CumulativeStats
     {
          const statObj = CumulativeStats.fromStorage();
          if( numGuesses > statObj.histogramBins.length || numGuesses <= 0 )
               throw new RangeError( 'RecordWin() invalid Attempts parameter value' );

          statObj.winningStreak++;
          statObj.gamesPlayed++;
          statObj.gamesWon++;
          statObj.histogramBins[ numGuesses - 1 ]++;
          statObj.persist();

          return statObj;
     }

     static recordLoss(): CumulativeStats
     {
          const statObj = CumulativeStats.fromStorage();

          statObj.winningStreak = 0;
          statObj.gamesPlayed++;
          statObj.persist();
          return statObj;
     }

     static reset() : void
     {
          const statObj = new CumulativeStats();
          statObj.persist();
     }

     persist() : void
     {
          localStorage.setItem( STAT_STORAGE_NAME, JSON.stringify( this ) );
     }

     // copy the array elements to target element-by-element to preserve reactivity
     copyHistogramBins( destArray: number[]) : void
     {
          if ( destArray.length != this.histogramBins.length ) 
               throw new RangeError( 'CopyBins() source and dest are different sizes' );

          for( let i = 0; i < this.histogramBins.length; i++ )
               destArray[ i ] = this.histogramBins[ i ];
     }

     static fromStorage( forceReset = false) : CumulativeStats
     {
          const statJSON = forceReset ? null : localStorage.getItem( STAT_STORAGE_NAME );
          if( statJSON !== null )
          {
               let statObj : CumulativeStats;
               try 
               {
                    statObj = JSON.parse( statJSON );
               }
               catch(err)
               {
                    const msg = err instanceof(Error) ? err.message : '** Exception unknown **';
                    console.warn(`JSON Exception loading stat from localstorage: ${msg}`);
                    statObj = new CumulativeStats();
               }
               return Object.assign( new CumulativeStats(), statObj );
          }
               // if not found, return an empty stat object
          return new CumulativeStats();
     }
}
