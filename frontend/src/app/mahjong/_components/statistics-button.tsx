"use client";
import { Button } from "@mui/material";
import { useRouter } from "next/navigation";

export function StatisticsButton() {
  const router = useRouter();
  return (
    <Button
      variant="contained"
      color="success"
      sx={{
        width: "100%",
        marginTop: "1rem",
        marginBottom: "1rem",
        fontSize: { xs: "1rem", sm: "1.2rem", md: "1.4rem" },
      }}
      onClick={() => router.push("/mahjong/statistics/player")}
    >
      통계 페이지
    </Button>
  );
}
