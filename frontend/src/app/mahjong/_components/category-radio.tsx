"use client";
import { FormControlLabel, Radio, RadioGroup } from "@mui/material";
import { Dispatch, SetStateAction } from "react";
import { MahjongCategory } from "@/types/mahjong";
import { MahjongCategoryValues } from "@/lib/constants/mahjong";

interface Props {
  defaultValue?: MahjongCategory;
  setCategory: Dispatch<SetStateAction<MahjongCategory>>;
}

export default function CategoryRadio({ defaultValue, setCategory }: Props) {
  return (
    <RadioGroup
      row
      onChange={(e, v) => setCategory(v as MahjongCategory)} // FIXME: DO NOT USE as STATEMENT
      defaultValue={defaultValue || "4마"}
    >
      {MahjongCategoryValues.map((category) => (
        <FormControlLabel
          key={category}
          value={category}
          control={<Radio />}
          label={category}
        />
      ))}
    </RadioGroup>
  );
}
