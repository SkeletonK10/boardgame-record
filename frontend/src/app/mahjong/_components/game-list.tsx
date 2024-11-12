"use client";
import { MahjongGameRecord } from "@/types/mahjong";
import { Button, Collapse, List } from "@mui/material";
import { useRouter } from "next/navigation";
import RecordEntry from "./record-entry";
import { TransitionGroup } from "react-transition-group";

interface MahjongGameListProps {
  record: MahjongGameRecord[];
}

export default function MahjongGameList({ record }: MahjongGameListProps) {
  const router = useRouter();
  return (
    <List sx={{ width: "100%" }}>
      <TransitionGroup>
        {record.slice(0, 10).map((value) => (
          <Collapse key={value.id}>
            <RecordEntry {...value} />
          </Collapse>
        ))}
      </TransitionGroup>
    </List>
  );
}
