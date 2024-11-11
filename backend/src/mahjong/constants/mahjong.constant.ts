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

export const MahjongYakumanValues = [
  '헤아림 역만',
  '천화',
  '지화',
  '스안커',
  '스안커 단기',
  '국사무쌍',
  '국사무쌍 13면 대기',
  '구련보등',
  '순정구련보등',
  '녹일색',
  '자일색',
  '청노두',
  '대삼원',
  '소사희',
  '대사희',
  '스깡즈',
] as const;

export const MAX_YAKUMAN_COUNT = 4;

export const OverlappableYakuman: Record<MahjongYakuman, MahjongYakuman[]> = {
  '헤아림 역만': [],
  천화: [
    '스안커',
    '스안커 단기',
    '국사무쌍',
    '국사무쌍 13면 대기',
    '구련보등',
    '순정구련보등',
    '녹일색',
    '자일색',
    '청노두',
    '대삼원',
    '소사희',
    '대사희',
  ],
  지화: [
    '스안커',
    '스안커 단기',
    '국사무쌍',
    '국사무쌍 13면 대기',
    '구련보등',
    '순정구련보등',
    '녹일색',
    '자일색',
    '청노두',
    '대삼원',
    '소사희',
    '대사희',
  ],
  스안커: [
    '천화',
    '지화',
    '녹일색',
    '자일색',
    '청노두',
    '대삼원',
    '소사희',
    '대사희',
    '스깡즈',
  ],
  '스안커 단기': [
    '천화',
    '지화',
    '녹일색',
    '자일색',
    '청노두',
    '대삼원',
    '소사희',
    '대사희',
    '스깡즈',
  ],
  국사무쌍: ['천화', '지화'],
  '국사무쌍 13면 대기': ['천화', '지화'],
  구련보등: ['천화', '지화'],
  순정구련보등: ['천화', '지화'],
  녹일색: ['천화', '지화', '스안커', '스안커 단기', '스깡즈'],
  자일색: [
    '천화',
    '지화',
    '스안커',
    '스안커 단기',
    '대삼원',
    '소사희',
    '대사희',
    '스깡즈',
  ],
  청노두: ['천화', '지화', '스안커', '스안커 단기', '스깡즈'],
  대삼원: ['천화', '지화', '스안커', '스안커 단기', '자일색', '스깡즈'],
  소사희: ['천화', '지화', '스안커', '스안커 단기', '자일색', '스깡즈'],
  대사희: ['천화', '지화', '스안커', '스안커 단기', '자일색', '스깡즈'],
  스깡즈: [
    '스안커',
    '스안커 단기',
    '녹일색',
    '자일색',
    '청노두',
    '대삼원',
    '소사희',
    '대사희',
  ],
};

export type MahjongYakuman = (typeof MahjongYakumanValues)[number];
