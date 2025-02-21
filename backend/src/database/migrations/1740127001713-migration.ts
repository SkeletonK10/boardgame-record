import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1740127001713 implements MigrationInterface {
    name = 'Migration1740127001713'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "mahjong_season_divider" ("id" SERIAL NOT NULL, "season" integer NOT NULL, "startGameId" integer NOT NULL, "endGameId" integer NOT NULL, CONSTRAINT "PK_e4eb64ba07ffe8b83d48f2e1e82" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "mahjong_season_divider"`);
    }

}
