import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1739869529083 implements MigrationInterface {
  name = 'Migration1739869529083';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "mahjong_rating" DROP CONSTRAINT "FK_98ab9459e51d64cb44a1e92f036"`,
    );
    await queryRunner.query(`DROP TABLE "mahjong_rating"`);
  }
  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "mahjong_rating" ("id" SERIAL NOT NULL, "category" character varying NOT NULL, "rating" numeric(10,2) NOT NULL DEFAULT '0', "playerId" integer, CONSTRAINT "PK_3fcea7c9b568af3a1337ca25098" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "mahjong_rating" ADD CONSTRAINT "FK_98ab9459e51d64cb44a1e92f036" FOREIGN KEY ("playerId") REFERENCES "mahjong_player"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }
}
