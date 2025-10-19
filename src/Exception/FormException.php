<?php

namespace App\Exception;

use App\Exception\AppException;

/**
 * Исключение, выбрасываемое при неверном заполнении форм.
 */
class FormException extends AppException
{
    /**
     * @param array<mixed> $errors
     */
    public function __construct(array $errors)
    {
        parent::__construct(json_encode($errors));
    }
}
