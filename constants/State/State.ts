import { Country } from "../Country/Country";

export type State = {
    id: number;
    name: string;
    country?: Country;
    createdAt?: Date;
    updatedAt?: Date;
}