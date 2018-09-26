<?php

namespace App\Event;

use Symfony\Component\EventDispatcher\Event;

class GalleryCreatedEvent extends Event
{
    /** @var  string */
    private $galleryId;

    public function __construct(string $galleryId)
    {
        $this->galleryId = $galleryId;
    }

    public function getGalleryId(): string
    {
        return $this->galleryId;
    }
}
