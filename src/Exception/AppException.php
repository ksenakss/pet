<?php

namespace App\Exception;

use Symfony\Component\HttpKernel\Exception\HttpException;

/**
 * Class AppException
 * Used for exceptions that must be sent to the frontend with message
 */
class AppException extends HttpException
{
    /**
     * AppException constructor.
     */
    public function __construct(string $message)
    {
        parent::__construct(200, $message);
    }
}
