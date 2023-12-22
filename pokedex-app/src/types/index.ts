export type Pokemon = {
    id?: number;
    name: string,
    number: number,
    gender: string,
    imageUrl: string,
    type: string[],
    weight: number,
    abilities: string[],
    stats?: Stat,
    pokemonTypes?: PokemonTypes[],
    hp: number,
    def: number,
    atk: number,
    spdf: number,
    spatk: number,
    spd: number,
    dummy?: boolean;
}

export type Stat = {
    hp: number;
    def: number,
    atk: number,
    spdf: number,
    spatk: number,
    spd: number,
}

export type User = {
    email?: string;
    expiration?: string;
    id: string;
    token: string;
    name: string;
}
export type PokemonTypes = {
    id: number,
    typeName: string
}