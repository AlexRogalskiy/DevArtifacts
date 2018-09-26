<?php

namespace App\Form;

use App\Validation\AvailableEmailConstraint;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\EmailType;
use Symfony\Component\Form\Extension\Core\Type\PasswordType;
use Symfony\Component\Form\Extension\Core\Type\RepeatedType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\Validator\Constraints\Email;
use Symfony\Component\Validator\Constraints\Length;
use Symfony\Component\Validator\Constraints\NotBlank;

class RegistrationFormType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('email', EmailType::class, [
                'label'       => 'Email',
                'attr'        => ['placeholder' => 'Email'],
                'constraints' => [
                    new NotBlank(),
                    new Email(),
                    new AvailableEmailConstraint(),
                ],
            ])
            ->add('password', RepeatedType::class, [
                'type'            => PasswordType::class,
                'invalid_message' => 'The password fields must match.',
                'options'         => ['attr' => ['class' => 'password-field']],
                'required'        => true,
                'first_options'   => [
                    'label'       => 'Password',
                    'attr'        => [
                        'placeholder' => 'Password',
                    ],
                    'constraints' => [
                        new NotBlank(),
                        new Length(['min' => 6, 'max' => 35]),
                    ],
                ],
                'second_options'  => [
                    'label' => 'Repeat Password',
                    'attr'  => [
                        'placeholder' => 'Repeat password',
                    ],
                ],
            ]);
    }
}
