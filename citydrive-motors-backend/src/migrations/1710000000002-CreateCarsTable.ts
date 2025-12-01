import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateCarsTable1710000000002 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'cars',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'title',
            type: 'varchar',
          },
          {
            name: 'brand',
            type: 'varchar',
          },
          {
            name: 'model',
            type: 'varchar',
          },
          {
            name: 'year',
            type: 'int',
          },
          {
            name: 'price',
            type: 'decimal',
            precision: 12,
            scale: 2,
          },
          {
            name: 'mileage',
            type: 'int',
          },
          {
            name: 'description',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'images',
            type: 'json',
            default: `'[]'`,
          },
          {
            name: 'isSold',
            type: 'boolean',
            default: false,
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updatedAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'ownerId',
            type: 'uuid',
            isNullable: true,
          },
        ],
      }),
    );

    await queryRunner.createForeignKey(
      'cars',
      new TableForeignKey({
        columnNames: ['ownerId'],
        referencedTableName: 'users',
        referencedColumnNames: ['id'],
        onDelete: 'SET NULL',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('cars', true);
  }
}
