export enum MahjongSeat {
  east,
  south,
  west,
  north,
}

// Basic Enumerations /////////////////////////////////////////////////////////

export const MahjongCategoryValues = ['4마', '3마'] as const;

export type MahjongCategory = (typeof MahjongCategoryValues)[number];

export const MahjongSubcategoryValues = ['반장전', '동풍전'] as const;

export type MahjongSubcategory = (typeof MahjongSubcategoryValues)[number];
