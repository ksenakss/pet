<?php

namespace App\Controller;

use App\Service\DatabaseSchemaService;
use App\Api\ApiResponse;
use Exception;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/database')]
class DatabaseSchemaController extends BaseController
{
    #[Route('/schema', name: 'api_database_schema', methods: ['GET'])]
    public function getSchema(DatabaseSchemaService $schemaService): Response
    {
        try {
            $schema = $schemaService->getSchema();
            return new ApiResponse($schema);
        } catch (\Exception $e) {
            throw new Exception(($e));
        }
    }
}
