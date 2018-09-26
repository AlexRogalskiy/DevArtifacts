<?php

namespace App\Twig;

use App\Entity\Gallery;
use App\Repository\GalleryRepository;
use Twig_Extension;

class SingleGalleryPageModulesTwigExtension extends Twig_Extension
{
    /** @var  \Twig_Environment */
    private $twig;

    /** @var  GalleryRepository */
    private $repository;

    public function __construct(\Twig_Environment $twig, GalleryRepository $repository)
    {
        $this->twig = $twig;
        $this->repository = $repository;
    }

    public function getFunctions()
    {
        return [
            new \Twig_Function('renderRelatedGalleries', [$this, 'renderRelatedGalleries'], ['is_safe' => ['html']]),
            new \Twig_Function('renderNewestGalleries', [$this, 'renderNewestGalleries'], ['is_safe' => ['html']]),
        ];
    }

    public function renderRelatedGalleries(Gallery $gallery, int $limit = 5)
    {
        return $this->twig->render('gallery/partials/_related-galleries.html.twig', [
            'galleries' => $this->repository->findRelated($gallery, $limit),
        ]);
    }

    public function renderNewestGalleries(int $limit = 5)
    {
        return $this->twig->render('gallery/partials/_newest-galleries.html.twig', [
            'galleries' => $this->repository->findNewest($limit),
        ]);
    }

}