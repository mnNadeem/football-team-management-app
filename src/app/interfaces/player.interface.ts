import { ITeam } from "./team.interface";

export interface IPlayer {
  id: number;
  name: string;
  position: string;
  price: number;
  isOnTransferList: boolean;
  team: ITeam
  teamId: number
}
