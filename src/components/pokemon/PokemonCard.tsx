import { PokemonDetails } from "@/interfaces"
import { capitalize } from "@/utils"
import Image from "next/image"

export const PokemonCard = ({ name, sprite, types }: PokemonDetails) => {
  return (
    <div className="flex flex-col bg-white dark:bg-gray-800 shadow-lg rounded-lg p-4 mt-4" key={name}>
      <div className="flex items-center">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white ms-2">{capitalize(name)}</h2>
        {types.map((type) => {
          return (
            <span key={`${name}-${type}`} className="px-2 py-1 text-xs font-medium text-white bg-blue-500 rounded-lg ms-2">{type}</span>
          )
        })}
      </div>
      <div className="flex items-center relative aspect-square h-[156px] w-[156px] mx-auto">
          <Image 
            src={sprite}
            alt={name}
            layout="fill"
            objectFit="contain"
          />
        </div>
    </div>
  )
}