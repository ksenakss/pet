<?php

namespace App\Controller;

use Cetp\Core\Exception\AppException;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;

/**
 * Базовый контроллер с переопределениями и общими для всех контроллеров проекта методами
 */
abstract class BaseController extends AbstractController
{
    /**
     * Парсинг данных с фронта.
     *
     * @param Request $request
     *
     * @return array<mixed> Данные с фронта.
     */
    public function getData(Request $request): array
    {
        $data = $request->request->get('data') ?? '{}';
        $data = json_decode($data, true);

        if (!$data || !is_array($data)) {
            throw new AppException('Данные не переданы!');
        }

        return $data;
    }
}
