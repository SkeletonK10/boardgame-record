'use client';
import { Box, CircularProgress, FormControlLabel, Radio, RadioGroup, Typography } from "@mui/material";
import { MahjongPlayerStatistics } from "./dto";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useEffect, useState, useTransition } from "react";
import { fetchPlayerStatistics } from "./actions";
import { text } from "@/lib/data";

const columns: GridColDef[] = [
    // { field: 'playerName', headerName: '아이디' },       // 필요 없을듯?
    { field: 'nickname', headerName: '이름', width: 70 },
    // { field: 'category', headerName: '카테고리' },       // 이미 카테고리는 나누어져 있음
    { field: 'rating', headerName: '우마 총합', type: 'number', width: 70 },
    { field: 'averageRating', headerName: '평균 우마', type: 'number', width: 70 },
    { field: 'averageScore', headerName: '평균 점수', type: 'number', width: 80 },
    { field: 'maxScore', headerName: '최고 점수', type: 'number', width: 80 },
    { field: 'minScore', headerName: '최소 점수', type: 'number', width: 80 },
    { field: 'count', headerName: '대국수', type: 'number', width: 70 },
    { field: 'first', headerName: '1등', type: 'number', width: 75 },
    { field: 'second', headerName: '2등', type: 'number', width: 75 },
    { field: 'third', headerName: '3등', type: 'number', width: 75 },
    { field: 'fourth', headerName: '4등', type: 'number', width: 75 },
    { field: 'tobi', headerName: '토비', type: 'number', width: 75 },
]



export default function MahjongPlayerStatisticsPage() {
  const [category, setCategory] = useState('4마');
  // TODO: 구분하기
  // const [subcategory, setSubcategory] = useState('반장전'); 
  const [stats, setStats] = useState<MahjongPlayerStatistics[]>([]);
  const [isPending, startTransition] = useTransition();
  
  useEffect(() => {
    startTransition(async () => await setStats(await fetchPlayerStatistics(category)));
    console.log(category);
  }, [category]);
  
  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      flexGrow: 1,
      alignItems: 'center',
      justifyContent: 'space-between'
    }}>
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
          display: { fontSize: '0.9rem', sm: "block" },
          userSelect: "none",
      }}>
        {text.mahjong.statistics.player.subtitle}
      </Typography>
      <RadioGroup row onChange={(e, v) => setCategory(v)}>
        <FormControlLabel value="3마" control={<Radio />} label="3마" />
        <FormControlLabel value="4마" control={<Radio />} label="4마" />
      </RadioGroup>
      {
        isPending ?
          (<CircularProgress />)
        :
          (
        
            <DataGrid
              rows={stats}
              columns={columns}
              sx={{
                width: "100%",
                
                "& .MuiDataGrid-columnHeaderTitle": {
                  whiteSpace: "normal",
                  lineHeight: "normal"
                },
              }}
              disableColumnMenu
              columnHeaderHeight={90}
            />
          )
      }
    </Box>
  );
}
