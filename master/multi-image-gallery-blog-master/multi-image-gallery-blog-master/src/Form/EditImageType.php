<?php

namespace App\Form;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\Validator\Constraints\NotBlank;

class EditImageType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('originalFilename', TextType::class, [
                'label'       => 'File name',
                'attr'        => ['placeholder' => 'File name'],
                'constraints' => [
                    new NotBlank(),
                ],
            ])
            ->add('description', MarkdownType::class, [
                'label'       => 'Description',
                'required'    => false,
                'constraints' => [
                    new NotBlank(),
                ],
            ]);
    }
}
