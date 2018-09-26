<?php

namespace App\Validation;

use App\Service\UserManager;
use Symfony\Component\Validator\Constraint;
use Symfony\Component\Validator\ConstraintValidator;

class AvailableEmailConstraintValidator extends ConstraintValidator
{
    /** @var  UserManager */
    private $userManager;

    /**
     * AvailableEmailConstraintValidator constructor.
     * @param UserManager $userManager
     */
    public function __construct(UserManager $userManager)
    {
        $this->userManager = $userManager;
    }

    public function validate($value, Constraint $constraint)
    {
        if (empty($value)) {
            return;
        }

        $user = $this->userManager->findByEmail($value);
        if (false === empty($user)) {
            $this->context->addViolation($constraint->message);
        }
    }

}
