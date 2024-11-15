"use client";
import { Box, Typography } from "@mui/material";
import { useEffect, useState, useTransition } from "react";
import { text } from "@/lib/data";
import { MahjongDetailedGameDto } from "@/types/mahjong";
import { fetchDetailedGame } from "./actions";

type Props = {
  params: {
    id: string;
  };
};

export default function MahjongDetailedGamePage({ params }: Props) {
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const [game, setGame] = useState<MahjongDetailedGameDto>();
    startTransition(
      async () => await setGame(await fetchDetailedGame(+params.id))
    );
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
        (경기 상세 페이지. 무슨 정보를 넣을까요...)
      </Typography>
    </Box>
  );
}
