<?php

namespace App\Repository;

use App\Entity\Gallery;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\EntityRepository;

class GalleryRepository
{
    /** @var  EntityRepository */
    private $repository;

    public function __construct(EntityManagerInterface $em)
    {
        $this->repository = $em->getRepository(Gallery::class);
    }

    public function findNewest($limit = 5)
    {
        return $this->repository->findBy([], ['createdAt' => 'DESC'], $limit);
    }

    public function findRelated(Gallery $gallery, $limit = 5)
    {
        return $this->repository->findBy(['user' => $gallery->getUser()], ['createdAt' => 'DESC'], $limit);
    }
}