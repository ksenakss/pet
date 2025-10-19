<?php
// src/Service/DatabaseSchemaService.php

namespace App\Service;

use Doctrine\ORM\EntityManagerInterface;

class DatabaseSchemaService
{
    public function __construct(
        private EntityManagerInterface $em
    ) {}

    public function getSchema(): array
    {
        $schemaManager = $this->em->getConnection()->createSchemaManager();
        $tables = $schemaManager->listTables();

        $schema = [];

        foreach ($tables as $table) {
            $tableInfo = [
                'name' => $table->getName(),
                'columns' => [],
                'indexes' => [],
                'foreignKeys' => []
            ];

            foreach ($table->getColumns() as $column) {
                $tableInfo['columns'][] = [
                    'name' => $column->getName(),
                    'type' => $column->getType()->getName(),
                    'notnull' => $column->getNotnull(),
                    'default' => $column->getDefault(),
                    'length' => $column->getLength(),
                    'precision' => $column->getPrecision(),
                    'scale' => $column->getScale(),
                    'unsigned' => $column->getUnsigned(),
                    'autoincrement' => $column->getAutoincrement(),
                    'comment' => $column->getComment(),
                ];
            }

            foreach ($table->getIndexes() as $index) {
                $tableInfo['indexes'][] = [
                    'name' => $index->getName(),
                    'columns' => $index->getColumns(),
                    'unique' => $index->isUnique(),
                    'primary' => $index->isPrimary(),
                ];
            }

            foreach ($table->getForeignKeys() as $foreignKey) {
                $tableInfo['foreignKeys'][] = [
                    'name' => $foreignKey->getName(),
                    'localColumns' => $foreignKey->getLocalColumns(),
                    'foreignTable' => $foreignKey->getForeignTableName(),
                    'foreignColumns' => $foreignKey->getForeignColumns(),
                ];
            }

            $schema[] = $tableInfo;
        }

        return $schema;
    }
}
