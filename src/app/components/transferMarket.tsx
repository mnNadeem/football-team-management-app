import { useState, useEffect } from "react";
import { Table, Input, InputNumber, Button, message } from "antd";
import axios from "axios";
import { IPlayer } from "../interfaces/player.interface";

export default function TransferMarket({ teamId }: IPlayer) {
  const [transfers, setTransfers] = useState([]);
  const [filters, setFilters] = useState({
    teamName: "",
    playerName: "",
    maxPrice: null,
  });

  useEffect(() => {
    fetchTransfers();
  }, []);

  const fetchTransfers = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BE_URI}/players/available-for-transfer`,
        {
          params: filters,
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setTransfers(response.data);
    } catch (error) {
      console.error("Error fetching transfers:", error);
    }
  };

  const handleBuy = async (playerId: number) => {
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_BE_URI}/transfers/${playerId}/buy`,
        {},
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      fetchTransfers();
    } catch (error) {
      console.error("Failed to buy player");
    }
  };

  const columns = [
    { title: "Player Name", dataIndex: "player_name", key: "player_name" },
    { title: "Position", dataIndex: "player_position", key: "player_position" },
    {
      title: "Selling Team",
      dataIndex: "sellingTeam_name",
      key: "sellingTeam_name",
    },
    {
      title: "Price",
      dataIndex: "player_price",
      key: "player_price",
      render: (price: number) => `$${price.toLocaleString()}`,
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Button
          onClick={() => handleBuy(record.player_id)}
          disabled={record.sellingTeam_id === teamId}
        >
          Buy
        </Button>
      ),
    },
  ];

  return (
    <div>
      <div className="mb-4 flex space-x-4">
        <Input
          placeholder="Team Name"
          value={filters.teamName}
          onChange={(e) => setFilters({ ...filters, teamName: e.target.value })}
        />
        <Input
          placeholder="Player Name"
          value={filters.playerName}
          onChange={(e) =>
            setFilters({ ...filters, playerName: e.target.value })
          }
        />
        <InputNumber
          placeholder="Max Price"
          value={filters.maxPrice}
          onChange={(value) => setFilters({ ...filters, maxPrice: value })}
        />
      </div>
      <Table dataSource={transfers} columns={columns} rowKey="player_id" />
    </div>
  );
}
