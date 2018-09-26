<?php

namespace App\Controller;

use App\Entity\Gallery;
use App\Service\UserManager;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\Routing\Annotation\Route;
use Twig_Environment;

class GalleryController
{
    /** @var  Twig_Environment */
    private $twig;

    /** @var  EntityManagerInterface */
    private $em;

    /** @var  UserManager */
    private $userManager;

    public function __construct(Twig_Environment $twig, EntityManagerInterface $em, UserManager $userManager)
    {
        $this->twig = $twig;
        $this->em = $em;
        $this->userManager = $userManager;
    }

    /**
     * @Route("/gallery/{id}", name="gallery.single-gallery")
     */
    public function homeAction($id)
    {
        $gallery = $this->em->getRepository(Gallery::class)->find($id);
        if (empty($gallery)) {
            throw new NotFoundHttpException();
        }

        $canEdit = false;
        $currentUser = $this->userManager->getCurrentUser();
        if (!empty($currentUser)) {
            $canEdit = $gallery->isOwner($currentUser);
        }

        $view = $this->twig->render('gallery/single-gallery.html.twig', [
            'gallery' => $gallery,
            'canEdit' => $canEdit,
        ]);

        return new Response($view);
    }

}
