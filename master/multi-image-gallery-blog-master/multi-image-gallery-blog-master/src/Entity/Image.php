<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use Ramsey\Uuid\Uuid;
use Ramsey\Uuid\UuidInterface;

/**
 * @ORM\Entity
 * @ORM\Table(name="images")
 */
class Image
{
    /**
     * @var Uuid
     * @ORM\Id
     * @ORM\Column(type="uuid", unique=true)
     * @ORM\GeneratedValue(strategy="CUSTOM")
     * @ORM\CustomIdGenerator(class="Ramsey\Uuid\Doctrine\UuidGenerator")
     */
    public $id;

    /**
     * @var string
     * @ORM\Column(type="string", nullable=false)
     */
    private $originalFilename;

    /**
     * @var string
     * @ORM\Column(type="string", nullable=false)
     */
    private $filename;

    /**
     * @var string
     * @ORM\Column(type="text", nullable=true)
     */
    private $description;

    /**
     * @var Gallery
     * @ORM\ManyToOne(targetEntity="Gallery", inversedBy="images")
     * @ORM\JoinColumn(referencedColumnName="id", name="gallery_id", nullable=true)
     */
    private $gallery;

    public function __construct(UuidInterface $id, $originalFilename, $filename)
    {
        $this->id = $id;
        $this->originalFilename = $originalFilename;
        $this->filename = $filename;
    }

    /**
     * @return Uuid
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * @return string
     */
    public function getOriginalFilename()
    {
        return $this->originalFilename;
    }

    /**
     * @param string $originalFilename
     */
    public function setOriginalFilename(string $originalFilename)
    {
        $this->originalFilename = $originalFilename;
    }

    /**
     * @return string
     */
    public function getFilename()
    {
        return $this->filename;
    }

    /**
     * @return string
     */
    public function getDescription()
    {
        return $this->description;
    }

    /**
     * @param string $description
     */
    public function setDescription($description)
    {
        $this->description = $description;
    }

    /**
     * @return Gallery
     */
    public function getGallery()
    {
        return $this->gallery;
    }

    /**
     * @param Gallery $gallery
     */
    public function setGallery(Gallery $gallery)
    {
        $this->gallery = $gallery;
    }

    public function canEdit(User $user)
    {
        return $this->getGallery()->isOwner($user);
    }

}
