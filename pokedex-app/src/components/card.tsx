import { Pokemon } from "../types"
import TypeChip from "./typeChip";
import { leadingZeroFormatter } from "@/utils";

type CardType = {
    pokemon: Pokemon;
}
export default function Card(props: CardType) {
    const { pokemon } = props;
    return(
        <div className="relative flex flex-col items-center gap-y-2 w-full rounded-[20px] bg-white shadow-lg pt-[100px] pb-6 max-w-[350px]">
            <div className="absolute top-[-40px] left-[calc(50%-50px)] max-w-[100px] w-full">
                <img src={pokemon.imageUrl} className="w-full h-full object-contain" />
            </div>
            <p className="text-[14px] font-bold text-[#7e8f9d]">{`Nº${leadingZeroFormatter(pokemon?.id || 0)}`}</p>
            <p className="text-[18px] font-bold text-[#2b3850]">{pokemon.name}</p>
            <TypeChip name={pokemon.type} />
        </div>
    )
}