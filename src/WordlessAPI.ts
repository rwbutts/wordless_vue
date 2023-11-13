"use strict";
// @ts-check

const API_SITE = process.env.VUE_APP_API_SITE;

const GETWORD_URI = process.env.VUE_APP_API_URI_GETWORD;
const CHECKWORD_URI =  process.env.VUE_APP_API_URI_CHECKWORD;
const GETMATCHCOUNT_URI = process.env.VUE_APP_API_URI_GETMATCHCOUNT;

export type CheckWordAsyncResponseType =
{ success: boolean, exists:boolean|undefined, message: string}

export type GetWordAsyncResponseType =
{ success: boolean, word:string, message: string}

export type GetMatchCountAsyncResponseType=
{ success: boolean, count:number, message: string}

export class WordlessAPI
{

     constructor ()
     {
     }

      async getWordAsync( daysAgo = -1) :  Promise<GetWordAsyncResponseType>
     {
          return getWordAsync( daysAgo);
     }

      async checkWordAsync( word :string) : Promise<CheckWordAsyncResponseType> 
      {
          return checkWordAsync( word);
      }

      async getMatchCountAsync( answer :string, guessArray: string[]  ) : Promise<GetMatchCountAsyncResponseType>
     {
          return getMatchCountAsync( answer, guessArray );
     }
}

export  async function getWordAsync( daysAgo = -1) :  Promise<GetWordAsyncResponseType>
     {
          try
          {
               let json = await _fetchAndGetJson( `${API_SITE}${GETWORD_URI}/${daysAgo}` );
               return  { word: json.word.toUpperCase(), success : true, message:'' };  
          }
          catch(err :any)
          {
               return  { word: '', success : false, message: err.message };  
          }  
     };

export async function checkWordAsync( Word :string) : Promise<CheckWordAsyncResponseType> 
      {
          let WordLC = Word.toLowerCase();
          try
          {
               let json = await _fetchAndGetJson( `${API_SITE}${CHECKWORD_URI}/${WordLC}` );
               return { exists: json.exists, success: true, message: '' };
          }
          catch( err :any )
          {
               return { exists: false, success: false, message: err.message,  };
          }
      };

export async function getMatchCountAsync( answer :string, guessArray: string[]  ) : Promise<GetMatchCountAsyncResponseType>
     {
          let postData = 
          { 
               answer: answer.toLowerCase(), 
               guesses: guessArray.map( (d) => d.toLowerCase() ),
          };

          try
          {
               let json = await _fetchAndGetJson( `${API_SITE}${GETMATCHCOUNT_URI}`, postData );
               return { count: json.count, success: true, message: '' };
          }
          catch( err : any)
          {
               return { count: -1, success: false, message: err.message,  };
          }
     };

     async function _fetchAndGetJson( Url: string, PostData: {[key:string] : any}|null = null ) : Promise<{ [key:string]: any }>
     {
          let RequestParams;
          if ( PostData === null )
          {
               RequestParams = {
                    method: 'GET',
                    headers: 
                    {
                         'Accept': '*/*',
                    },
               }
          }
          else
          {
               RequestParams = {
                    method: 'POST',
                    mode: 'cors',
                    headers: 
                    {
                         'Accept': '*/*',
                         'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(PostData),
               }
          }
          let response = await fetch( Url, RequestParams as any );
          if (!response.ok )
          {
               throw new Error( `${response.statusText}: status ${response.status}` );
          }
          return response.json();
     }

export const wordlessApiService = new WordlessAPI();

