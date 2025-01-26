import { Card } from "antd";
import { ITeamProps } from "../interfaces/TeamProps.interface";

export default function TeamInfo({ team }: ITeamProps) {
  return (
    <Card title="Team Information">
      <p>Name: {team.name}</p>
      <p>Budget: ${team?.budget?.toLocaleString()}</p>
      <p>Total Players: {team.players?.length}</p>
    </Card>
  );
}
