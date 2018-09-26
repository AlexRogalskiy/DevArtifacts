<?php

namespace App\Controller;

use App\Entity\Gallery;
use App\Form\EditGalleryType;
use App\Service\UserManager;
use Doctrine\ORM\EntityManagerInterface;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Component\Form\FormFactoryInterface;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Session\Flash\FlashBagInterface;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\Routing\RouterInterface;
use Twig_Environment;

class EditGalleryController
{
    /** @var EntityManagerInterface */
    private $em;

    /** @var  FormFactoryInterface */
    private $formFactory;

    /** @var  FlashBagInterface */
    private $flashBag;

    /** @var  RouterInterface */
    private $router;

    /** @var  Twig_Environment */
    private $twig;

    /** @var  UserManager */
    private $userManager;

    public function __construct(
        EntityManagerInterface $em,
        FormFactoryInterface $formFactory,
        FlashBagInterface $flashBag,
        RouterInterface $router,
        Twig_Environment $twig,
        UserManager $userManager
    ) {
        $this->em = $em;
        $this->formFactory = $formFactory;
        $this->flashBag = $flashBag;
        $this->router = $router;
        $this->twig = $twig;
        $this->userManager = $userManager;
    }

    /**
     * @Route("/gallery/{id}/delete", name="gallery.delete")
     */
    public function deleteImageAction(Request $request, $id)
    {
        $gallery = $this->em->getRepository(Gallery::class)->find($id);
        if (empty($gallery)) {
            throw new NotFoundHttpException('Gallery not found');
        }

        $currentUser = $this->userManager->getCurrentUser();
        if (empty($currentUser) || false === $gallery->isOwner($currentUser)) {
            throw new AccessDeniedHttpException();
        }

        $this->em->remove($gallery);
        $this->em->flush();

        $this->flashBag->add('success', 'Gallery deleted');

        return new RedirectResponse($this->router->generate('home'));
    }

    /**
     * @Route("/gallery/{id}/edit", name="gallery.edit")
     */
    public function editGalleryAction(Request $request, $id)
    {
        $gallery = $this->em->getRepository(Gallery::class)->find($id);
        if (empty($gallery)) {
            throw new NotFoundHttpException('Gallery not found');
        }

        $currentUser = $this->userManager->getCurrentUser();
        if (empty($currentUser) || false === $gallery->isOwner($currentUser)) {
            throw new AccessDeniedHttpException();
        }

        $galleryDto = [
            'name'        => $gallery->getName(),
            'description' => $gallery->getDescription(),
        ];

        $form = $this->formFactory->create(EditGalleryType::class, $galleryDto);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $gallery->setDescription($form->get('description')->getData());
            $gallery->setName($form->get('name')->getData());
            $this->em->flush();

            $this->flashBag->add('success', 'Gallery updated');

            return new RedirectResponse($this->router->generate('gallery.edit', ['id' => $gallery->getId()]));
        }

        $view = $this->twig->render('gallery/edit-gallery.html.twig', [
            'gallery' => $gallery,
            'form'    => $form->createView(),
        ]);

        return new Response($view);
    }

}
