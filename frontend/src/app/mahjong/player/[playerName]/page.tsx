"use client";
import { Box, Grid2 as Grid, List, Typography } from "@mui/material";
import { text } from "@/lib/data";
import { LineChart } from "@mui/x-charts";
import React, { useEffect, useState, useTransition } from "react";
import { fetchPlayer } from "./actions";
import {
  MahjongCategory,
  MahjongPlayerStatistics,
  MahjongPlayerPageDto,
} from "@/types/mahjong";
import CategoryRadio from "../../_components/category-radio";
import RecordEntry from "../../_components/record-entry";
import { useSearchParams } from "next/navigation";
import { MahjongCategoryValues } from "@/lib/constants/mahjong";

type Props = {
  params: {
    playerName?: string;
  };
};

const chartOptions: Record<MahjongCategory, Object> = {
  "4마": {
    yAxis: [
      {
        max: 5,
        min: 0,
        reverse: true,
        tickInterval: [1, 2, 3, 4],
      },
    ],
  },
  "3마": {
    yAxis: [
      {
        max: 4,
        min: 0,
        reverse: true,
        tickInterval: [1, 2, 3],
      },
    ],
  },
};

const testPlayer: MahjongPlayerPageDto = {
  playerName: "testA",
  nickname: "테스트",
  rankings: {
    "4마": [],
    "3마": [],
  },
  records: {
    "4마": [],
    "3마": [],
  },
  statistics: {
    "4마": new MahjongPlayerStatistics(),
    "3마": new MahjongPlayerStatistics(),
  },
};

const normalLabel = [
  ["대국수", "count"],
  ["우마 총합", "rating"],
  ["평균 우마", "averageRating"],
  ["평균 점수", "averageScore"],
  ["최고 점수", "maxScore"],
  ["최소 점수", "minScore"],
];
const ratioLabel = [
  ["1등", "first"],
  ["2등", "second"],
  ["3등", "third"],
  ["4등", "fourth"],
  ["토비", "tobi"],
];

// BUG: 존재하지 않는 playerName 입력 시 페이지가 터짐!! 에러 페이지로 가게 해줘
export default function MahjongPlayerPage({ params }: Props) {
  const searchParams = useSearchParams();
  const initialCategory: MahjongCategory =
    searchParams.has("category") &&
    MahjongCategoryValues.includes(
      searchParams.get("category") as MahjongCategory
    )
      ? (searchParams.get("category") as MahjongCategory)
      : "4마";
  const playerName: string = params.playerName
    ? decodeURI(params.playerName)
    : "ERROR";
  const [player, setPlayer] = useState<MahjongPlayerPageDto>(testPlayer);
  const [category, setCategory] = useState<MahjongCategory>(initialCategory);
  const [isPending, startTransition] = useTransition();
  const stat: any = {
    ...player.statistics[category],
  };

  useEffect(() => {
    startTransition(async () => await setPlayer(await fetchPlayer(playerName)));
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
        {text.mahjong.player.title(player.nickname)}
      </Typography>
      <CategoryRadio defaultValue={category} setCategory={setCategory} />
      <Box sx={{ width: "100%", height: "30vh" }}>
        <LineChart
          series={[
            {
              curve: "linear",
              color: "#33AAEE",
              label: "최근 순위",
              data: player.rankings[category],
            },
          ]}
          margin={{ left: 20, right: 20, top: 20 }}
          grid={{ horizontal: true }}
          loading={isPending}
          bottomAxis={null}
          {...chartOptions[category]}
        />
      </Box>
      <Grid container spacing={1} sx={{ width: "100%" }}>
        {normalLabel.map(([label, key]) => {
          return (
            <React.Fragment key={key}>
              <Grid size={{ xs: 6, sm: 3, md: 2 }}>
                <Typography
                  noWrap
                  component="div"
                  sx={{
                    display: { sm: "block" },
                    userSelect: "none",
                  }}
                >
                  {label}
                </Typography>
              </Grid>
              <Grid size={{ xs: 6, sm: 3, md: 2 }}>
                <Typography sx={{ fontSize: "0.9rem" }}>{stat[key]}</Typography>
              </Grid>
            </React.Fragment>
          );
        })}
        {ratioLabel.map(([label, key]) => {
          const percentage = ((stat[key] / stat["count"]) * 100).toFixed(2);
          return (
            <React.Fragment key={key}>
              <Grid size={{ xs: 6, sm: 3, md: 2 }}>
                <Typography
                  noWrap
                  component="div"
                  sx={{
                    display: { sm: "block" },
                    userSelect: "none",
                  }}
                >
                  {label}
                </Typography>
              </Grid>
              <Grid size={{ xs: 6, sm: 3, md: 2 }}>
                <Typography sx={{ fontSize: "0.9rem" }}>
                  {stat[key]}
                  {`(${percentage}%)`}
                </Typography>
              </Grid>
            </React.Fragment>
          );
        })}
      </Grid>
      <List sx={{ width: "100%" }}>
        {player.records[category].map((value) => (
          <RecordEntry key={value.id} {...value} />
        ))}
      </List>
    </Box>
  );
}
