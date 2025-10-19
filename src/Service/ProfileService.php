<?php

namespace App\Service;

use App\Entity\User;
use App\Entity\Company;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;

class ProfileService
{
    public function __construct(
        UserRepository $userRepository,
        EntityManagerInterface $entityManager,
    ) {
        $this->userRepository = $userRepository;
        $this->em = $entityManager;
    }

    public function getProfileData(User $user): array
    {
        $company = $user->getCompany();

        return [
            'id' => $user->getId(),
            'username' => $user->getUsername(),
            'name' => $user->getName(),
            'companyName' => $company->getName(),
            'description' => $company->getDescription(),
        ];
    }

    public function updateProfile(User $user, array $data): void
    {
        $company = $user->getCompany();

        $user->setUsername($data['username']);
        $user->setName($data['name']);

        $company->setName($data['companyName']);
        $company->setDescription($data['description']);

        $this->em->flush();
    }
}
