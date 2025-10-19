<?php

namespace App\Controller;

use App\Api\ApiResponse;
use App\Exception\FormException;
use App\Service\AuthService;
use App\Api\ApiError;
use App\Service\ProfileService;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/profile')]
class ProfileController extends BaseController
{
    #[Route('/load', methods: ['GET'])]
    public function loadProfile(
        ProfileService $profileService,
    ): Response
    {
        $user = $this->getUser();
        $userInfo = $profileService->getProfileData($user);

        return new ApiResponse($userInfo);
    }

    #[Route('/save', methods: ['POST'])]
    public function saveProfile(
        Request $request,
        EntityManagerInterface $em,
        ProfileService $profileService,
    ): Response
    {
        $errors = [];

        $dataStr = $request->get('data');
        if (empty($dataStr)) {
            return new ApiError('Не переданы данные');
        }

        $data = json_decode($dataStr, true);
        if ($data === null) {
            return new ApiError('Не удалось декодировать данные');
        }

        $required = ['username', 'name', 'companyName', 'description'];
        $required = array_filter($required, static function ($name) use ($data) {
            return !($data[$name] ?? null);
        });

        if ($required) {
            $errors = array_reduce($required, static function ($acc, $name) {
                $acc["user.$name"] = 'Это поле обязательно для заполнения';

                return $acc;
            }, []);
        }
        if ($errors) {
            throw new FormException($errors);
        }

        $user = $this->getUser();
        $profileService->updateProfile($user, $data);

        return new ApiResponse([
            'message' => 'Профиль изменен',
        ]);
    }
}
