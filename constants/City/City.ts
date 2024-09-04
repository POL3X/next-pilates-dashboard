import { State } from "../State/State";

export type City={
id: number;
name: string;
state: State;
createdAt?: Date;
updatedAt?: Date;
}