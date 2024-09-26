"use client";
import { Box, Typography } from "@mui/material";
import { text } from "@/lib/data";
import { LineChart } from "@mui/x-charts";
import { useEffect, useState, useTransition } from "react";
import { MahjongPlayerPageDto } from "./dto";
import { fetchPlayer } from "./actions";
import { MahjongCategory } from "../../dto";
import { CategoryRadio } from "../../_components/category-radio";

type Props = {
  params: {
    playerName?: string;
  };
};

const chartOptions = {
  [MahjongCategory.fourPlayer]: {
    yAxis:[{
      max: 5,
      min: 0,
      reverse: true,
      tickInterval: [1, 2, 3, 4],
    }]
  },
  [MahjongCategory.threePlayer]: {
    yAxis: [{
      max: 4,
      min: 0,
      reverse: true,
      tickInterval: [1, 2, 3],
    }]
  },
}

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
      <CategoryRadio setCategory={setCategory} />
      <Box sx={{ width: '100%', height: '30vh' }}>
        <LineChart
          series={[
            {
              curve: "linear",
              color: "#33AAEE",
              label: "최근 순위",
              data: player.records[category].map(({ rank }) => +rank),
            },
          ]}
          margin={{ left: 20, right: 20, top: 20, }}
          grid={{ horizontal: true }}
          loading={isPending}
          bottomAxis={null}
          {...chartOptions[category]}
        />
      </Box>
    </Box>
  );
}
