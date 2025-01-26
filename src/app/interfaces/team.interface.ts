import { IPlayer } from "./player.interface";

export interface ITeam {
  id: number;
  name: string;
  budget: number;
  players: IPlayer[];
}
