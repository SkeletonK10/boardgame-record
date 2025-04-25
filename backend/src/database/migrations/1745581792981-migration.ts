import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1745581792981 implements MigrationInterface {
  name = 'Migration1745581792981';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "mahjong_player" ADD "gameCount" integer NOT NULL DEFAULT 0`,
    );
    await queryRunner.query(
      `UPDATE "mahjong_player" p SET "gameCount" = (SELECT COUNT(*) FROM "mahjong_player_record" r WHERE r."playerId" = p."id")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "mahjong_player" DROP COLUMN "gameCount"`,
    );
  }
}
