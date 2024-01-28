"use strict";
// @ts-check

const API_SITE = process.env.VUE_APP_API_SITE;

const GETWORD_URI = process.env.VUE_APP_API_URI_GETWORD;
const CHECKWORD_URI =  process.env.VUE_APP_API_URI_CHECKWORD;
const GETMATCHCOUNT_URI = process.env.VUE_APP_API_URI_GETMATCHCOUNT;

const HTTP_VER_HEADER = "X-wordless-api-version";

export type CheckWordAsyncResponseType =
{ success: boolean, exists:boolean|undefined, message: string, apiVersion?: string }

export type GetWordAsyncResponseType =
{ success: boolean, word:string|undefined, message: string, apiVersion?: string }

export type GetMatchCountAsyncResponseType=
{ success: boolean, count:number|undefined, message: string, apiVersion?: string }

export class WordlessAPI
{
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

async function getWordAsync( daysAgo = -1) :  Promise<GetWordAsyncResponseType>
{
     try
     {
          const json = await _fetchAndGetJson( `${API_SITE}${GETWORD_URI}/${daysAgo}` );
          return  { word: (json.word as string).toUpperCase(), success : true, message:'',  apiVersion: json.apiVersion  as string };  
     }
     catch(err : unknown)
     {
          return  { word: undefined, success : false, message: (err as Error).message };  
     }  
}

export async function checkWordAsync( Word :string) : Promise<CheckWordAsyncResponseType> 
{
     const WordLC = Word.toLowerCase();
     try
     {
          const json = await _fetchAndGetJson( `${API_SITE}${CHECKWORD_URI}/${WordLC}` );
          return { exists: json.exists as boolean, success: true, message: '',  apiVersion: json.apiVersion as string };
     }
     catch( err : unknown )
     {
          return { exists: undefined, success: false, message: (err as Error).message,  };
     }
}

export async function getMatchCountAsync( answer :string, guessArray: string[]  ) : Promise<GetMatchCountAsyncResponseType>
{
     const postData = 
     { 
          answer: answer.toLowerCase(), 
          guesses: guessArray.map( (d) => d.toLowerCase() ),
     };

     try
     {
          const json = await _fetchAndGetJson( `${API_SITE}${GETMATCHCOUNT_URI}`, postData );
          return { count: json.count as number, success: true, message: '', apiVersion: json.apiVersion as string };
     }
     catch( err : unknown )
     {
          return { count: undefined, success: false, message: (err as Error).message,};
     }
}

async function _fetchAndGetJson( Url: string, PostData: Record<string,unknown>|null = null ) : Promise<Record<string,unknown>>
{
     let RequestParams: RequestInit;
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

     const response = await fetch( Url, RequestParams );
     if (!response.ok )
     {
          throw new Error( `[${response.status}] ${response.statusText}` );
     }
     
     const json = await response.json();
     json['apiVersion']  = response.headers.get(HTTP_VER_HEADER) ?? 'n/a';
     return Promise.resolve(json);
}

export const wordlessApiService = new WordlessAPI();
