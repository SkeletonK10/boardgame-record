"use client";
import { text } from "@/lib/data";
import {
  MahjongCategory,
  MahjongPlayerStatistics,
  MahjongSeasonDto,
} from "@/types/mahjong";
import { TabContext, TabList } from "@mui/lab";
import { Box, MenuItem, Select, Tab, Typography } from "@mui/material";
import { DataGrid, GridColDef, GridEventListener } from "@mui/x-data-grid";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { format } from "url";
import CategoryRadio from "../../_components/category-radio";
import { fetchPlayerStatistics, fetchSeasons } from "./actions";
import { getRunningSeasons } from "@/lib/utils";

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

const now = new Date().toISOString();

export default function MahjongPlayerStatisticsPage() {
  const router = useRouter();
  const [category, setCategory] = useState<MahjongCategory>("4마");
  const [tabValue, setTabValue] = useState("season");
  const [period, setPeriod] = useState({ start: now, end: now });
  const [isSeason, setIsSeason] = useState(true);
  const [seasons, setSeasons] = useState<MahjongSeasonDto[]>([]);
  const [selectedSeason, setSelectedSeason] = useState<number>(0);
  // TODO: 구분하기
  // const [subcategory, setSubcategory] = useState('반장전');
  const [stats, setStats] = useState<MahjongPlayerStatistics[]>([]);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    startTransition(async () => {
      const seasonResponse = await fetchSeasons();
      setSeasons(seasonResponse);
      if (seasonResponse.length > 0) {
        const runningSeasons = getRunningSeasons(seasonResponse);
        setSelectedSeason(
          runningSeasons.length > 0 ? runningSeasons[0].season ?? 0 : 0
        );
      }
    });
  }, []);

  useEffect(() => {
    const { start, end } = period;
    startTransition(async () => {
      await setStats(
        await fetchPlayerStatistics({
          isSeason,
          selectedSeason,
          category,
          start,
          end,
        })
      );
    });
  }, [category, period, isSeason, selectedSeason]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setTabValue(newValue);
    const now = new Date();
    if (newValue === "season") {
      setIsSeason(true);
    } else if (newValue === "all") {
      // 전체 기간
      setIsSeason(false);
      setPeriod({
        start: "1970-01-01T00:00:00Z",
        end: now.toISOString(),
      });
    } else if (newValue === "year") {
      // 최근 1년
      setIsSeason(false);
      setPeriod({
        start: new Date(
          new Date().setFullYear(now.getFullYear() - 1)
        ).toISOString(),
        end: now.toISOString(),
      });
    } else if (newValue === "month") {
      // 최근 1달
      setIsSeason(false);
      setPeriod({
        start: new Date(new Date().setMonth(now.getMonth() - 1)).toISOString(),
        end: now.toISOString(),
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
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          width: "100%",
          justifyContent: "space-between",
        }}
      >
        <Select
          size="small"
          sx={{
            visibility: tabValue === "season" ? "visible" : "hidden",
          }}
          value={selectedSeason}
          defaultValue={selectedSeason}
          onChange={(e) => setSelectedSeason(e.target.value as number)}
        >
          {seasons.map((season) => (
            <MenuItem key={season.season} value={season.season}>
              시즌 {season.season}
            </MenuItem>
          ))}
        </Select>
        <TabContext value={tabValue}>
          <TabList onChange={handleTabChange}>
            <Tab label="시즌별" value="season" />
            <Tab label="전체 기간" value="all" />
            <Tab label="최근 1년" value="year" />
            <Tab label="최근 1달" value="month" />
          </TabList>
        </TabContext>
      </Box>
      <DataGrid
        rows={stats}
        columns={columns}
        loading={isPending}
        onRowClick={handleRowClick}
        getRowId={(row) => row.playerName}
        sx={{
          width: "100%",
          "& .MuiDataGrid-columnHeaderTitle": {
            whiteSpace: "normal",
            lineHeight: "normal",
          },
        }}
        autoHeight
        disableColumnMenu
        disableColumnResize
        columnHeaderHeight={90}
      />
    </Box>
  );
}
