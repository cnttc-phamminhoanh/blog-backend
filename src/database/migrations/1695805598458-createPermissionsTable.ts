import { MigrationInterface, QueryRunner } from "typeorm";

export class CreatePermissionsTable1695805598458 implements MigrationInterface {
    name = 'CreatePermissionsTable1695805598458'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "permissions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "userId" uuid NOT NULL, "status" character varying NOT NULL DEFAULT 'ACTIVE', "roleName" character varying NOT NULL, CONSTRAINT "PK_920331560282b8bd21bb02290df" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "permissions" ADD CONSTRAINT "FK_eab26c6cc4b9cc604099bc32dff" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "permissions" DROP CONSTRAINT "FK_eab26c6cc4b9cc604099bc32dff"`);
        await queryRunner.query(`DROP TABLE "permissions"`);
    }

}
