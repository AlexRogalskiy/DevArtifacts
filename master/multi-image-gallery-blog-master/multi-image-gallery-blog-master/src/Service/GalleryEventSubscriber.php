<?php

namespace App\Service;

use App\Entity\Gallery;
use App\Entity\Image;
use App\Event\GalleryCreatedEvent;
use Doctrine\ORM\EntityManager;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;

class GalleryEventSubscriber implements EventSubscriberInterface
{
    /** @var  JobQueueFactory */
    private $jobQueueFactory;

    /** @var  EntityManagerInterface */
    private $entityManager;

    public function __construct(JobQueueFactory $jobQueueFactory, EntityManagerInterface $entityManager)
    {
        $this->jobQueueFactory = $jobQueueFactory;
        $this->entityManager = $entityManager;
    }

    public static function getSubscribedEvents()
    {
        return [
            GalleryCreatedEvent::class => 'onGalleryCreated',
        ];
    }

    public function onGalleryCreated(GalleryCreatedEvent $event)
    {
        $queue = $this->jobQueueFactory
            ->createQueue()
            ->useTube(JobQueueFactory::QUEUE_IMAGE_RESIZE);

        $gallery = $this->entityManager
            ->getRepository(Gallery::class)
            ->find($event->getGalleryId());

        if (empty($gallery)) {
            return;
        }

        /** @var Image $image */
        foreach ($gallery->getImages() as $image) {
            $queue->put($image->getId());
        }
    }
}
