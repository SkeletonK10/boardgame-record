"use client";
import { MahjongGameRecord } from "@/types/mahjong";
import { Box, Button, Collapse, List } from "@mui/material";
import { useRouter } from "next/navigation";
import RecordEntry from "./record-entry";
import { TransitionGroup } from "react-transition-group";
import { useState } from "react";

interface MahjongGameListProps {
  record: MahjongGameRecord[];
}

export default function MahjongGameList({ record }: MahjongGameListProps) {
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
  const handleSortButtonClick = () => {
    setSortOrder(sortOrder === "newest" ? "oldest" : "newest");
  };

  const sortedRecord = record
    .sort((a, b) => {
      if (sortOrder === "newest") {
        return b.createdAt.localeCompare(a.createdAt);
      } else {
        return a.createdAt.localeCompare(b.createdAt);
      }
    })
    .slice(0, 10);

  return (
    <Box>
      <Button onClick={handleSortButtonClick} size="small">
        {sortOrder === "newest" ? "최신순" : "과거순"}
      </Button>
      <List sx={{ width: "100%" }}>
        <TransitionGroup>
          {sortedRecord.map((value) => (
            <Collapse key={value.id}>
              <RecordEntry {...value} />
            </Collapse>
          ))}
        </TransitionGroup>
      </List>
    </Box>
  );
}
