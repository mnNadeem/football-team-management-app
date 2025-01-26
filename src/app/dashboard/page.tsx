"use client";

import { useState, useEffect } from "react";
import { Layout, Menu, Button } from "antd";
import axios from "axios";
import TeamInfo from "../components/TeamInfo";
import PlayerList from "../components/PlayerList";
import { useRouter } from "next/navigation";
import TransferMarket from "../components/transferMarket";

const { Header, Content, Sider } = Layout;

export default function Dashboard() {
  const [team, setTeam] = useState(null);
  const [currentPage, setCurrentPage] = useState("team");
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/");
    } else {
      fetchTeamData(token);
    }
  }, [router]);

  const fetchTeamData = async (token: string) => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BE_URI}/teams`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setTeam(response.data);
    } catch (error) {
      console.error("Error fetching team data:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/");
  };

  const menuItems = [
    {
      key: "team",
      label: "Team",
      onClick: () => setCurrentPage("team"),
    },
    {
      key: "players",
      label: "Players",
      onClick: () => setCurrentPage("players"),
    },
    {
      key: "transfers",
      label: "Transfer Market",
      onClick: () => setCurrentPage("transfers"),
    },
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider>
        <div className="logo" />
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={["team"]}
          items={menuItems}
        />
      </Sider>
      <Layout>
        <Header className="bg-white flex justify-between items-center px-4">
          <h1 className="text-2xl font-bold">Football Manager</h1>
          <Button onClick={handleLogout}>Logout</Button>
        </Header>
        <Content className="p-6">
          {currentPage === "team" && team && <TeamInfo team={team} />}
          {currentPage === "players" && team && <PlayerList />}
          {currentPage === "transfers" && <TransferMarket teamId={team?.id} />}
        </Content>
      </Layout>
    </Layout>
  );
}
