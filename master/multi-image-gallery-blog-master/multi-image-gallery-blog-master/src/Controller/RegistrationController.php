<?php

namespace App\Controller;

use App\Form\RegistrationFormType;
use App\Service\UserManager;
use Symfony\Component\Form\FormFactoryInterface;
use Symfony\Component\Form\FormInterface;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Session\Flash\FlashBagInterface;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Routing\RouterInterface;
use Twig_Environment;

class RegistrationController
{
    /** @var  FormFactoryInterface */
    private $formFactory;

    /** @var  Twig_Environment */
    private $twig;

    /** @var  FlashBagInterface */
    private $flashBag;

    /** @var  RouterInterface */
    private $router;

    /** @var UserManager */
    private $userManager;

    public function __construct(
        FormFactoryInterface $formFactory,
        Twig_Environment $twig,
        FlashBagInterface $flashBag,
        RouterInterface $router,
        UserManager $userManager
    ) {
        $this->formFactory = $formFactory;
        $this->twig = $twig;
        $this->flashBag = $flashBag;
        $this->router = $router;
        $this->userManager = $userManager;
    }

    private function createRegistrationForm(Request $request)
    {
        $form = $this->formFactory->create(RegistrationFormType::class);
        $form->handleRequest($request);

        return $form;
    }

    /**
     * @Route("/register", name="register")
     */
    public function registerAction(Request $request)
    {
        $form = $this->createRegistrationForm($request);

        if ($form->isSubmitted() && $form->isValid()) {
            return $this->handleRegistrationFormSubmission($form, $request);
        }

        $view = $this->twig->render('security/registration.html.twig', [
            'form' => $form->createView(),
        ]);

        return new Response($view);
    }

    private function handleRegistrationFormSubmission(FormInterface $form, Request $request)
    {
        $data = $form->getData();
        $user = $this->userManager->register($data);
        $this->userManager->login($user, $request);
        $this->flashBag->add('success', 'You\'ve been registered successfully');

        return new RedirectResponse($this->router->generate('home'));
    }

}
