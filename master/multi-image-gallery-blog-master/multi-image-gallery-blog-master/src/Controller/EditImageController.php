<?php

namespace App\Controller;

use App\Entity\Gallery;
use App\Entity\Image;
use App\Form\EditImageType;
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

class EditImageController
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
     * @Route("/image/{id}/delete", name="image.delete")
     */
    public function deleteImageAction(Request $request, $id)
    {
        $image = $this->em->getRepository(Image::class)->find($id);
        if (empty($image)) {
            throw new NotFoundHttpException('Image not found');
        }

        $currentUser = $this->userManager->getCurrentUser();
        if (empty($currentUser) || false === $image->canEdit($currentUser)) {
            throw new AccessDeniedHttpException();
        }

        /** @var Gallery $gallery */
        $gallery = $image->getGallery();
        $this->em->remove($image);
        $this->em->flush();

        $this->flashBag->add('success', 'Image deleted');

        return new RedirectResponse($this->router->generate('gallery.single-gallery', ['id' => $gallery->getId()]));
    }

    /**
     * @Route("/image/{id}/edit", name="image.edit")
     */
    public function editImageAction(Request $request, $id)
    {
        $image = $this->em->getRepository(Image::class)->find($id);
        if (empty($image)) {
            throw new NotFoundHttpException('Image not found');
        }

        $currentUser = $this->userManager->getCurrentUser();
        if (empty($currentUser) || false === $image->canEdit($currentUser)) {
            throw new AccessDeniedHttpException();
        }

        $imageDto = [
            'originalFilename' => $image->getOriginalFilename(),
            'description'      => $image->getDescription(),
        ];

        $form = $this->formFactory->create(EditImageType::class, $imageDto);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $image->setDescription($form->get('description')->getData());
            $image->setOriginalFilename($form->get('originalFilename')->getData());
            $this->em->flush();

            $this->flashBag->add('success', 'Image updated');

            return new RedirectResponse($this->router->generate('image.edit', ['id' => $image->getId()]));
        }

        $view = $this->twig->render('image/edit-image.html.twig', [
            'image' => $image,
            'form'  => $form->createView(),
        ]);

        return new Response($view);
    }

}
