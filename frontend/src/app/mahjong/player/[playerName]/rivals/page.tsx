"use client";

import {
  MahjongCategory,
  MahjongRival,
  MahjongRivalPageDto,
} from "@/types/mahjong";
import { Box, CircularProgress, Icon, Typography } from "@mui/material";
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from "chart.js";
import React, { useEffect, useState, useTransition } from "react";
import { Bar } from "react-chartjs-2";
import { fetchRivalsPage } from "./actions";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

type Props = {
  params: {
    playerName?: string;
  };
};

const sampleRivals: MahjongRival[] = [
  { playerName: "Rival 1", nickname: "Rival", win: 5, lose: 3 },
  { playerName: "Rival 2", nickname: "Rival", win: 2, lose: 6 },
  { playerName: "Rival 3", nickname: "Rival", win: 3, lose: 1 },
];

const RivalsPage = ({ params }: Props) => {
  const [nickname, setNickname] = useState<string>("");
  const [rivals, setRivals] = useState<MahjongRival[]>(sampleRivals);
  const [category, setCategory] = useState<MahjongCategory>("4마");
  const [isPending, startTransition] = useTransition();
  const [isLoading, setIsLoading] = useState(true);
  const playerName: string = params.playerName
    ? decodeURI(params.playerName)
    : "";
  useEffect(() => {
    setIsLoading(true);
    startTransition(async () => {
      const rivalsPage = await fetchRivalsPage(playerName, category);
      setNickname(rivalsPage.nickname);
      setRivals(rivalsPage.rivals);
    });
    setIsLoading(false);
  }, []);

  const data = {
    labels: rivals.map((rival) => rival.nickname),
    datasets: [
      {
        label: "승리",
        data: rivals.map((rival) => rival.win),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
      {
        label: "패배",
        data: rivals.map((rival) => rival.lose),
        backgroundColor: "rgba(255, 99, 132, 0.6)",
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false, // 그래프가 부모 컨테이너에 맞게 조정되도록 설정
    indexAxis: "y" as const, // 가로 막대 그래프 설정
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          font: {
            size: 12, // 모바일 환경에 적합한 폰트 크기
          },
        },
      },
      title: {
        display: true,
        text: `승패 통계 (많이 플레이한 순)`,
        font: {
          size: 16, // 모바일 환경에 적합한 제목 크기
        },
      },
    },
    scales: {
      x: {
        stacked: true, // X축 스택 설정
        grid: {
          drawOnChartArea: true, // 세로선 표시
        },
        title: {
          display: true,
          text: "Count",
          font: {
            size: 12, // 모바일 환경에 적합한 폰트 크기
          },
        },
      },
      y: {
        stacked: true, // Y축 스택 설정
        grid: {
          drawOnChartArea: false, // 가로선 제거
        },
        ticks: {
          font: {
            size: 12, // 모바일 환경에 적합한 폰트 크기
          },
        },
      },
    },
  };

  return (
    <Box
      sx={{
        padding: { xs: 2, sm: 4 }, // 모바일 환경에서는 더 작은 패딩
        height: { xs: "300px", sm: "500px" }, // 모바일 환경에서 적절한 높이 설정
      }}
    >
      {isLoading || isPending ? (
        <CircularProgress />
      ) : (
        <>
          <Typography variant="h5" gutterBottom>
            {nickname}의 라이벌
          </Typography>
          <Bar data={data} options={options} />
        </>
      )}
    </Box>
  );
};

export default RivalsPage;
