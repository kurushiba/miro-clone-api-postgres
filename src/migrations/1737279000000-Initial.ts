import { MigrationInterface, QueryRunner } from 'typeorm';

export class Initial1737279000000 implements MigrationInterface {
  name = 'Initial1737279000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Enable UUID extension
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

    // User Table
    await queryRunner.query(`CREATE TABLE "user" (
            "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
            "name" character varying NOT NULL,
            "email" character varying NOT NULL,
            "password" character varying NOT NULL,
            "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
            "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
            CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id")
        )`);
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_e12875dfb3b1d92d7d7c5377e2" ON "user" ("email")`,
    );

    // Board Table
    await queryRunner.query(`CREATE TABLE "board" (
            "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
            "name" character varying NOT NULL,
            "ownerId" uuid NOT NULL,
            "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
            "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
            CONSTRAINT "PK_865a0f2e22c140d261b1df80eb1" PRIMARY KEY ("id")
        )`);

    // BoardObject Table
    await queryRunner.query(`CREATE TABLE "board_object" (
            "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
            "boardId" uuid NOT NULL,
            "type" character varying NOT NULL DEFAULT 'sticky',
            "x" double precision NOT NULL,
            "y" double precision NOT NULL,
            "width" double precision,
            "height" double precision,
            "content" text,
            "color" character varying,
            "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
            "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
            CONSTRAINT "PK_7b32525547cb0287e029141f237" PRIMARY KEY ("id")
        )`);

    // Foreign Keys
    await queryRunner.query(
      `ALTER TABLE "board" ADD CONSTRAINT "FK_28b36d22306d2036w4398283" FOREIGN KEY ("ownerId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );

    await queryRunner.query(
      `ALTER TABLE "board_object" ADD CONSTRAINT "FK_823908234892304892304" FOREIGN KEY ("boardId") REFERENCES "board"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "board_object" DROP CONSTRAINT "FK_823908234892304892304"`,
    );
    await queryRunner.query(
      `ALTER TABLE "board" DROP CONSTRAINT "FK_28b36d22306d2036w4398283"`,
    );
    await queryRunner.query(`DROP TABLE "board_object"`);
    await queryRunner.query(`DROP TABLE "board"`);
    await queryRunner.query(`DROP INDEX "IDX_e12875dfb3b1d92d7d7c5377e2"`);
    await queryRunner.query(`DROP TABLE "user"`);
  }
}
