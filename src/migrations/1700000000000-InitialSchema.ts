import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1700000000000 implements MigrationInterface {
  name = 'InitialSchema1700000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create users table
    await queryRunner.query(`
      CREATE TABLE "users" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "name" character varying(100) NOT NULL,
        "email" character varying NOT NULL,
        CONSTRAINT "UQ_users_email" UNIQUE ("email"),
        CONSTRAINT "PK_users_id" PRIMARY KEY ("id")
      )
    `);

    // Create products table
    await queryRunner.query(`
      CREATE TABLE "products" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "name" character varying(100) NOT NULL,
        "quantity" integer NOT NULL DEFAULT 0,
        CONSTRAINT "UQ_products_name" UNIQUE ("name"),
        CONSTRAINT "PK_products_id" PRIMARY KEY ("id"),
        CONSTRAINT "CHK_products_quantity" CHECK ("quantity" >= 0)
      )
    `);

    // Create transactions table
    await queryRunner.query(`
      CREATE TYPE "transactions_type_enum" AS ENUM('INBOUND', 'OUTBOUND')
    `);

    await queryRunner.query(`
      CREATE TABLE "transactions" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "productId" uuid NOT NULL,
        "type" "transactions_type_enum" NOT NULL,
        "quantityChanged" integer NOT NULL,
        "timestamp" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_transactions_id" PRIMARY KEY ("id"),
        CONSTRAINT "FK_transactions_product" FOREIGN KEY ("productId") 
          REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE NO ACTION
      )
    `);

    // Create index on transactions for better query performance
    await queryRunner.query(`
      CREATE INDEX "IDX_transactions_productId" ON "transactions" ("productId")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_transactions_timestamp" ON "transactions" ("timestamp")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "IDX_transactions_timestamp"`);
    await queryRunner.query(`DROP INDEX "IDX_transactions_productId"`);
    await queryRunner.query(`DROP TABLE "transactions"`);
    await queryRunner.query(`DROP TYPE "transactions_type_enum"`);
    await queryRunner.query(`DROP TABLE "products"`);
    await queryRunner.query(`DROP TABLE "users"`);
  }
}
