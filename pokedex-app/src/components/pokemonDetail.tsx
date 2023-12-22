import React from 'react'
import { Pokemon } from "../types"
import TypeChip from "./typeChip";
import { leadingZeroFormatter, statsColors, statsObj } from "@/utils";
import { TypeIcon } from "./typeIcon";
import { EditIcon } from '@chakra-ui/icons'

type PokemonDetail = {
    pokemon: Pokemon;
    handleEdit: () => void;
    isLogged: boolean;
}
function GenderIcons({ gender = "M" }: { gender: string }) {
    const genders = [
        {
            name: "Masculino", class: 'text-[#0f445a] bg-[#85ddff] border border-[#85ddff]',
        },
        {
            name: "Femenino", class: 'text-[#cf2b44] bg-white border border-[#cf2b44]',
        },
        {
            name: "Ninguno", class: 'text-white bg-[#1e293b] border border-[#1e293b]',
        },
    ]
    const selectedGender = genders.find(g => g.name === gender);
    return(
        <div className={`${selectedGender?.class} w-[40px] h-[40px] p-2 flex justify-center items-center uppercase text-[25px] font-bold rounded-[10px]`}>
            { gender[0] }
        </div>
    )
}
export default function PokemonDetail(props: PokemonDetail) {
    const { pokemon, handleEdit, isLogged } = props;
    return(
        <div className="relative flex flex-col items-center gap-y-2 w-full rounded-[20px] bg-white shadow-lg p-10">
            <div className="absolute top-[-110px] left-[calc(50%-125px)] max-w-[250px] w-full">
                <img src={pokemon.imageUrl} className="w-full h-full object-contain" />
            </div>
            <div className={`w-full flex ${isLogged ? 'justify-between' : 'justify-end'} items-center pb-24`}>
                {
                    isLogged &&
                    <button type='button' onClick={handleEdit}>
                        <EditIcon w={8} h={8} color="#041430" />
                    </button>
                }
                <GenderIcons gender= {pokemon.gender} />
            </div>
            <p className="text-[18px] font-bold text-[#7e8f9d]">{`#${leadingZeroFormatter(pokemon?.id || 0)}`}</p>
            <p className="text-[30px] font-bold text-[#2b3850]">{pokemon.name}</p>
            <TypeChip name={pokemon.type} />
            <h3 className="uppercase text-[18px] text-[#041430] font-bold tracking-[1.5px] pt-2">Entrada Pokedex</h3>
            <p className="font-semibold text-[16px] text-center">
                There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words.
            </p>

            <div className="w-full pt-6 flex flex-col gap-y-4">
                <h3 className="uppercase text-[18px] text-[#041430] font-bold tracking-[1.5px] pt-2 text-center">Habilidades</h3>
                <div className="flex flex-nowrap gap-x-4 w-full">
                    {
                        pokemon.abilities.map((a, index) => (
                            <div 
                                key={`${a}-${index}`} 
                                className="border border-[#b6c4d5] rounded-full w-full bg-[#f6f8fc] py-2"
                            >
                                <p className="text-[17px] text-[#041430] font-bold text-center">{a}</p>
                            </div>
                        ))
                    }
                </div>
            </div>

            <div className="max-w-[140px] w-full pt-6 flex flex-col gap-y-4">
                <h3 className="uppercase text-[18px] text-[#041430] font-bold tracking-[1.5px] pt-2 text-center">Peso</h3>
                <div  
                    className="rounded-full bg-[#f6f8fc] py-2"
                >
                    <p className="text-[17px] text-[#041430] font-bold text-center">{`${pokemon.weight}Kg`}</p>
                </div>
            </div>
            <div className="max-w-[200px] w-full pt-6 flex flex-col gap-y-4 items-center">
                <h3 className="uppercase text-[18px] text-[#041430] font-bold tracking-[1.5px] pt-2 text-center">Debilidades</h3>
                <div className="rounded-full w-full bg-[#f6f8fc] py-2 flex gap-x-4 justify-center">
                    {
                        pokemon.type.map((t, index) => (
                            <React.Fragment key={`${t}-${index}`} >
                                <TypeIcon type={t} />
                            </React.Fragment>
                        ))
                    }
                </div>
            </div>

            <div className="w-full pt-6 flex flex-col gap-y-4 items-center">
                <h3 className="uppercase text-[18px] text-[#041430] font-bold tracking-[1.5px] pt-2 text-center">Estadísticas</h3>
                <div className="flex gap-x-4 justify-center">
                    {
                        statsObj().map((so, index) => {
                            const key = so.value as string
                            const colors = statsColors();
                            const color = colors[key as keyof typeof pokemon.stats];
                            return(
                                <div className="bg-[#f6f8fc] rounded-full px-1 pt-1 pb-2 flex flex-col gap-y-1 justify-center items-center" key={`${so.value}-${index}`} >
                                    <div className={`flex justify-center items-center rounded-full w-[35px] h-[35px] text-white text-[12px] uppercase ${color}`}>
                                        <p>{so.value}</p>
                                    </div>
                                    <p className='text-[16px] text-[#041430] font-bold'>{pokemon[key as keyof typeof pokemon.stats]}</p>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        </div>
    )
}