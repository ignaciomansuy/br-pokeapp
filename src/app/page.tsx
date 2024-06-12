"use client";
import { FormEvent, useState } from "react";
import { distance } from "fastest-levenshtein"

import { PokemonIndex } from "../interfaces";


async function getData() {
  const res = await fetch('https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0')
  // The return value is *not* serialized
  // You can return Date, Map, Set, etc.
 
  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error('Failed to fetch data')
  }
 
  return res.json()
}



export default function Page() {
  let allPokeData: PokemonIndex[] = []
  getData().then(data => allPokeData = data.results)
  const [searchString, setSearchString] = useState('');

  const [pokeData, setPokeData] = useState(null);


  async function searchStringSimilarity(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    let distances = allPokeData.map((element) => {
      return {
        name: element.name,
        url: element.url,
        distance: distance(searchString, element.name)
      }
    })
    distances.sort((a, b) => a.distance - b.distance)
    distances = distances.slice(0, 6)
    
  }

  return (
    <form onSubmit={searchStringSimilarity} className="max-w-md mx-auto">   
      <label className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
      <div className="relative">
          <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
              <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
              </svg>
          </div>
          <input value={searchString} onChange={(e)=> setSearchString(e.target.value)} type="search" id="default-search" className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search Pokemon name..." required />
          <button type="submit" className="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Search</button>
      </div>
  </form>
  );
}