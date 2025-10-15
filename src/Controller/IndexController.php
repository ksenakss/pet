<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/')]
class IndexController extends AbstractController
{
    #[Route('/', name: 'landing')]
    public function index(): Response
    {
        return $this->render('base.html.twig');
    }

    #[Route('/initialize')] // Без /api префикса как в рабочем проекте
    public function initialize(): JsonResponse
    {
        $user = $this->getUser();
        $userInfo = null;

        if ($user) {
            $userInfo = [
                'id' => $user->getId(),
                'username' => $user->getUserIdentifier(),
                'roles' => $user->getRoles(),
                'accesses' => [],
            ];
        }

        $responseData = [
            'user' => $userInfo,
            'config' => [
                'maxDocUploadSize' => 10 * 1024 * 1024,
                'allowedUploadExtensions' => ['pdf', 'doc', 'docx'],
                'allowedUploadMimeTypes' => ['application/pdf', 'application/msword'],
                'serverTime' => (new \DateTime('now'))->format(\DateTime::ATOM),
            ],
            'systemConfig' => [],
            'procedureTypes' => [],
        ];

        return new JsonResponse($responseData);
    }
}
