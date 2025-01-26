"use client";

import { Table, Button, InputNumber } from "antd";
import axios from "axios";
import { IPlayer } from "../interfaces/player.interface";
import { useEffect, useState } from "react";

export default function PlayerList() {
  const [players, setPlayers] = useState([]);

  const handleTransferList = async (
    player: IPlayer,
    isOnTransferList: Boolean,
    price: string
  ) => {
    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_BE_URI}/players/${player.id}/transfer-status`,
        { isOnTransferList, price: parseInt(price) },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
    } catch (error) {
      console.error("Failed to update player transfer status");
    }
  };

  useEffect(() => {
    fetchPlayers();
  }, []);

  const fetchPlayers = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BE_URI}/players`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setPlayers(response.data);
    } catch (error) {
      console.error("Error fetching Players:", error);
    }
  };

  const columns = [
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Position", dataIndex: "position", key: "position" },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (price: number) => `$${price.toLocaleString()}`,
    },
    {
      title: "Transfer List",
      key: "transferList",
      render: (_, player) => (
        <div>
          <InputNumber
            min={0}
            defaultValue={player.price}
            onChange={(value) => (player.newPrice = value)}
            style={{ width: 120, marginRight: 8 }}
          />
          <Button
            onClick={() =>
              handleTransferList(
                player,
                !player.isOnTransferList,
                player.newPrice || player.price
              )
            }
          >
            {player.isOnTransferList
              ? "Remove from Transfer List"
              : "Add to Transfer List"}
          </Button>
        </div>
      ),
    },
  ];

  return <Table dataSource={players} columns={columns} rowKey="id" />;
}
