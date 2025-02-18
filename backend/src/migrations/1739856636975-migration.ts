import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddRatingDiff1739856636975 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE mahjong_player_record
      ADD COLUMN "ratingDiff" DECIMAL(10, 2);`);

    // Update ratingDiff column
    // 4마: ((score / 1000) - 25000) + UMA
    await queryRunner.query(`
      UPDATE mahjong_player_record SET "ratingDiff" = 
      (CAST(score AS DECIMAL(10, 2)) / 1000 +
      CASE WHEN (SELECT category FROM mahjong_game_record WHERE id="gameId") = '4마'
      
      THEN (CASE WHEN rank = 1 THEN -10
            WHEN rank = 2 THEN -20
            WHEN rank = 3 THEN -30
                          ELSE -40 END)
      ELSE (CASE WHEN rank = 1 THEN -20
            WHEN rank = 2 THEN -35
            WHEN rank = 3 THEN -50 END) END) 
      / (CASE WHEN
        (SELECT subcategory FROM mahjong_game_record WHERE id="gameId") = '반장전'
        THEN 1 ELSE 2 END);`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE mahjong_player_record
      DROP COLUMN ratingDiff;`);
  }
}
