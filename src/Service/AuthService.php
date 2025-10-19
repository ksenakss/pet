<?php

namespace App\Service;

use App\Entity\Company;
use App\Entity\User;
use App\Exception\FormException;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

/**
 * Сервис для авторизации/регистрации пользователей/организаций.
 */
class AuthService
{
    /**
     * @var EntityManagerInterface
     */
    private $em;

    public function __construct(
        EntityManagerInterface $em,
        UserPasswordHasherInterface $hasher,
    )
    {
        $this->em = $em;
        $this->hasher = $hasher;
    }

    /**
     * Регистрация пользователя/организации
     *
     * @param array<mixed> $data
     *
     * @return User
     *
     * @throws \Throwable
     */
    public function register(array $userData, array $companyData): void
    {
        $company = $this->createCompany($companyData);
        $this->em->persist($company);

        $user = $this->createUser($userData);
        $user->setCompany($company);
        $this->em->persist($user);
        $this->em->commit();
    }

    public function createCompany(array $data): Company
    {
        $company = new Company();
        $company->setName($data['name']);
        $company->setDescription($data['description']);

        return $company;
    }

    public function createUser(array $data): User
    {
        $user = new User();
        $user->setUsername($data['username']);
        $user->setName($data['name']);
        $password = $this->hasher->hashPassword($user, $data['password']);
        $user->setPassword($password);

        return $user;
    }
}
