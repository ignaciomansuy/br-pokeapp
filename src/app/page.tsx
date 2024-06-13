"use client";
import { FormEvent, useState } from "react";
import { distance } from "fastest-levenshtein"
import Image from "next/image"

import { PokemonIndex, PokemonDetails } from "../interfaces";
import { PokemonCard } from "@/components/pokemon/PokemonCard";


async function getData() {
  // The url is hardcoded because we are not using it any where else on the project
  // Otherwise it should go to the .env file, and probably use a fetch hook to get the data
  const res = await fetch('https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0')
  if (!res.ok) {
    throw new Error('Failed to fetch data')
  }
 
  return res.json()
}

const getPokemonSimilarity = async (allPokeData: PokemonIndex[], searchString: string, limit: number = 6) => {

  let similarPokemons = allPokeData.map((element) => {
    return {
      name: element.name,
      url: element.url,
      distance: distance(searchString, element.name)
    }
  })
  similarPokemons.sort((a, b) => a.distance - b.distance)
  return similarPokemons.slice(0, limit)
}

const getPokemonDetails = async (url: string) => {
  const res = await fetch(url)
  if (!res.ok) {
    throw new Error('Failed to fetch data of pokemon details')
  }
  const data = await res.json()
  return {
    name: data.name,
    sprite: data.sprites.front_default,
    types: data.types.map((type: any) => type.type.name)
  }
}


export default function Page() {
  let allPokeData: PokemonIndex[] = []
  getData().then(data => allPokeData = data.results)

  const [searchString, setSearchString] = useState('');
  const [pokeData, setPokeData] = useState<PokemonDetails[]>([]);

  const handleSearch = async (event: FormEvent<HTMLFormElement>) =>  {
    event.preventDefault()
    let similarPokemons = await getPokemonSimilarity(allPokeData, searchString)
    let pokeDetails = await Promise.all(similarPokemons.map((element) => getPokemonDetails(element.url)))
    setPokeData(pokeDetails)
  }


  return (
    <div className="h-screen flex flex-col ">
      <form onSubmit={handleSearch} className="max-w-md mx-auto py-6 w-1/3">  
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
      <div className="grid grid-cols-3 justify-items-center w-4/5 mx-auto">
        {pokeData.length > 0 && (pokeData.map((element) => {
          return PokemonCard(element)
        }))}
      </div>
    </div>
  );
}