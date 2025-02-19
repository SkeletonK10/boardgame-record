"use client";
import { Box, CircularProgress, Tab, Typography } from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { MahjongCategory, MahjongPlayerStatistics } from "@/types/mahjong";
import { DataGrid, GridColDef, GridEventListener } from "@mui/x-data-grid";
import { useEffect, useState, useTransition } from "react";
import { fetchPlayerStatistics } from "./actions";
import { text } from "@/lib/data";
import CategoryRadio from "../../_components/category-radio";
import { useRouter } from "next/navigation";
import { format } from "url";
import { getCurrentQuarter } from "@/lib/utils";

const columns: GridColDef[] = [
  // { field: 'playerName', headerName: '아이디' },       // 필요 없을듯?
  { field: "nickname", headerName: "이름", width: 70 },
  // { field: 'category', headerName: '카테고리' },       // 이미 카테고리는 나누어져 있음
  { field: "rating", headerName: "우마 총합", type: "number", width: 70 },
  {
    field: "averageRating",
    headerName: "평균 우마",
    type: "number",
    width: 80,
  },
  { field: "averageScore", headerName: "평균 점수", type: "number", width: 80 },
  { field: "maxScore", headerName: "최고 점수", type: "number", width: 80 },
  { field: "minScore", headerName: "최소 점수", type: "number", width: 80 },
  { field: "count", headerName: "대국수", type: "number", width: 70 },
  { field: "first", headerName: "1등", type: "number", width: 75 },
  { field: "second", headerName: "2등", type: "number", width: 75 },
  { field: "third", headerName: "3등", type: "number", width: 75 },
  { field: "fourth", headerName: "4등", type: "number", width: 75 },
  { field: "tobi", headerName: "토비", type: "number", width: 75 },
];

export default function MahjongPlayerStatisticsPage() {
  const router = useRouter();
  const [category, setCategory] = useState<MahjongCategory>("4마");
  const [tabValue, setTabValue] = useState("1");
  const [period, setPeriod] = useState({
    start: "1970-01-01",
    end: "9999-12-31",
  });
  // TODO: 구분하기
  // const [subcategory, setSubcategory] = useState('반장전');
  const [stats, setStats] = useState<MahjongPlayerStatistics[]>([]);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const { start, end } = period;
    console.log(start, end);
    startTransition(
      async () =>
        await setStats(await fetchPlayerStatistics(category, start, end))
    );
    // console.log(category);
  }, [category, period]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setTabValue(newValue);
    if (newValue === "1") {
      setPeriod(getCurrentQuarter());
    } else if (newValue === "2") {
      setPeriod({
        start: new Date(new Date().setFullYear(new Date().getFullYear() - 1))
          .toISOString()
          .slice(0, 10),
        end: new Date().toISOString().slice(0, 10),
      });
    } else if (newValue === "3") {
      setPeriod({
        start: new Date(new Date().setMonth(new Date().getMonth() - 1))
          .toISOString()
          .slice(0, 10),
        end: new Date().toISOString().slice(0, 10),
      });
    }
  };

  const handleRowClick: GridEventListener<"rowClick"> = (params) => {
    router.push(
      format({
        pathname: `/mahjong/player/${params.row.playerName}`,
        query: { category },
      })
    );
  };
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
        {text.mahjong.statistics.player.title}
      </Typography>
      <Typography
        noWrap
        component="div"
        sx={{
          display: { fontSize: "0.9rem", sm: "block" },
          userSelect: "none",
        }}
      >
        {text.mahjong.statistics.player.subtitle}
      </Typography>
      <CategoryRadio setCategory={setCategory} />
      <TabContext value={tabValue}>
        <TabList onChange={handleTabChange}>
          <Tab label="현재 시즌" value="1" />
          <Tab label="최근 1년" value="2" />
          <Tab label="최근 1달" value="3" />
        </TabList>
      </TabContext>
      {isPending ? (
        <CircularProgress />
      ) : (
        <DataGrid
          rows={stats}
          columns={columns}
          onRowClick={handleRowClick}
          getRowId={(row) => row.playerName}
          sx={{
            width: "100%",

            "& .MuiDataGrid-columnHeaderTitle": {
              whiteSpace: "normal",
              lineHeight: "normal",
            },
          }}
          disableColumnMenu
          disableColumnResize
          columnHeaderHeight={90}
        />
      )}
    </Box>
  );
}
