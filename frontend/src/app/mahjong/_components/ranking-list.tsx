"use client";
import { MahjongCategory, MahjongRankingRecord } from "@/types/mahjong";
import { Box, List, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import RankingEntry from "./ranking-entry";

interface MahjongRankingListProps {
  category: MahjongCategory;
  ranking: MahjongRankingRecord[];
}

export default function MahjongRankingList({
  category,
  ranking,
}: MahjongRankingListProps) {
  const router = useRouter();
  return (
    <Box
      key={category}
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Typography
        variant="h6"
        noWrap
        component="div"
        sx={{
          margin: "8px 0",
          display: { sm: "block" },
          userSelect: "none",
          flexGrow: 1,
        }}
      >
        {`시즌 ${category} 순위`}
      </Typography>
      {ranking.length === 0 ? (
        <Typography variant="body2" sx={{ flexGrow: 1 }}>
          {`아직 순위가 없습니다. ${category} 경기를 해보세요!`}
        </Typography>
      ) : (
        <List sx={{ width: "100%" }}>
          {ranking.map((value) => (
            <RankingEntry
              key={value.playerName}
              category={category}
              {...value}
            />
          ))}
        </List>
      )}
    </Box>
  );
}
