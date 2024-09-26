"use client";
import { Box, Typography } from "@mui/material";
import { text } from "@/lib/data";
import { LineChart } from "@mui/x-charts";
import { useEffect, useState, useTransition } from "react";
import { MahjongPlayerPageDto } from "./dto";
import { fetchPlayer } from "./actions";
import { MahjongCategory } from "../../dto";

type Props = {
  params: {
    playerName?: string;
  };
};

const testPlayer: MahjongPlayerPageDto = {
  records: {
    [MahjongCategory.fourPlayer]: [],
    [MahjongCategory.threePlayer]: [],
  },
};

export default function MahjongPlayerPage({ params }: Props) {
  const playerName: string = params.playerName
    ? decodeURI(params.playerName)
    : "ERROR";
  const [player, setPlayer] = useState<MahjongPlayerPageDto>(testPlayer);
  const [category, setCategory] = useState<MahjongCategory>(
    MahjongCategory.fourPlayer
  );
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    startTransition(async () => await setPlayer(await fetchPlayer(playerName)));
    // console.log(category);
  }, []);
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        flexGrow: 1,
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <Typography
        variant="h6"
        noWrap
        component="div"
        sx={{
          display: { sm: "block" },
          userSelect: "none",
        }}
      >
        {text.mahjong.player.title(playerName)}
      </Typography>
      <LineChart
        series={[
          {
            curve: "linear",
            data: player.records[category].map(({ rank }) => rank),
          },
        ]}
      ></LineChart>
    </Box>
  );
}
