<?php

namespace App\Controller;

use App\Api\ApiResponse;
use App\Entity\User;
use App\Exception\FormException;
use Doctrine\ORM\EntityManagerInterface;
use Exception;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use App\Service\AuthService;

#[Route('/auth')]
class AuthController extends BaseController
{
    #[Route('/registration', methods: ['POST'])]
    public function register(
        Request $request,
        AuthService $authService,
        EntityManagerInterface $em,
    ): Response
    {
        $data = $this->getData($request)['registrationData'];
        $errors = [];
        $userData = $data['user'];
        $companyData = $data['company'];
        $required = ['username', 'name', 'password', 'confirmPassword'];
        $required = array_filter($required, static function ($name) use ($userData) {
            return !($userData[$name] ?? null);
        });
        if ($required) {
            $errors = array_reduce($required, static function ($acc, $name) {
                $acc["user.$name"] = 'Это поле обязательно для заполнения';

                return $acc;
            }, []);
        }
        if (!isset($errors['user.password']) && !isset($errors['user.confirmPassword'])
            && $userData['confirmPassword'] !== $userData['password']) {
            $errors['user.confirmPassword'] = 'Пароли не совпадают';
        }
        if ($errors) {
            throw new FormException($errors);
        }

        $em->beginTransaction();
        try {
            $authService->register($userData, $companyData);
        } catch (\Throwable $e) {
            $em->rollback();

            throw new Exception($e);
        }
        $em->flush();

        return new ApiResponse('ok');
    }

    #[Route('/login', name: 'app_login', methods: ['POST'])]
    public function login()
    {
        $this->getUser();

        return new ApiResponse('ok');
    }

    #[Route('/logout', name: 'app_logout', methods: ['GET'])]
    public function logout()
    {
        // controller can be blank: it will never be executed!
    }
}
