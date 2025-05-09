import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1740129709759 implements MigrationInterface {
  name = 'Migration1740129709759';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "mahjong_season" ("id" SERIAL NOT NULL, "season" integer NOT NULL, "startDate" TIMESTAMP NOT NULL, "endDate" TIMESTAMP, CONSTRAINT "PK_a142b54f9abd40d34f6546a8500" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `INSERT INTO mahjong_season (season, "startDate") VALUES (0, '1970-01-01')`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "mahjong_season"`);
  }
}
