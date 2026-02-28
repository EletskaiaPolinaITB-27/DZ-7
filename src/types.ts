export interface ICountryShort {
    name: string;
    alpha3Code: string;
    independent: boolean
}
export interface ICountry {
    name: string;
    capital: string;
    population: number;
    flag: string;
    borders?: string[]
}