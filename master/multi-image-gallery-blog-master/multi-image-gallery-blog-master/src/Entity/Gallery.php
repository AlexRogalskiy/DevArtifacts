<?php

namespace App\Entity;

use DateTime;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Ramsey\Uuid\Uuid;
use Ramsey\Uuid\UuidInterface;

/**
 * @ORM\Entity
 * @ORM\Table(name="galleries")
 */
class Gallery
{
    /**
     * @var Uuid
     *
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
    private $name;

    /**
     * @var string
     * @ORM\Column(type="text", nullable=true)
     */
    private $description;

    /**
     * @var Collection
     * @ORM\OneToMany(targetEntity="Image", orphanRemoval=true, cascade={"persist", "remove"}, mappedBy="gallery")
     */
    private $images;

    /**
     * @var User
     * @ORM\ManyToOne(targetEntity="User", inversedBy="galleries")
     * @ORM\JoinColumn(referencedColumnName="id", name="user_id", nullable=false)
     */
    private $user;

    /**
     * @var DateTime
     * @ORM\Column(type="datetime", nullable=false)
     */
    private $createdAt;

    public function __construct(UuidInterface $id)
    {
        $this->id = $id;
        $this->images = new ArrayCollection();
        $this->createdAt = new DateTime();
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
    public function getName()
    {
        return $this->name;
    }

    /**
     * @param string $name
     */
    public function setName($name)
    {
        $this->name = $name;
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
     * @return Collection
     */
    public function getImages()
    {
        return $this->images;
    }

    public function addImage(Image $image)
    {
        if (false === $this->images->contains($image)) {
            $image->setGallery($this);
            $this->images->add($image);
        }
    }

    public function removeImage(Image $image)
    {
        if (true === $this->images->contains($image)) {
            $this->images->removeElement($image);
        }
    }

    /**
     * @return User
     */
    public function getUser(): User
    {
        return $this->user;
    }

    /**
     * @param User $user
     */
    public function setUser(User $user)
    {
        $this->user = $user;
    }

    public function isOwner(User $user)
    {
        return $this->user === $user;
    }

    /**
     * @return DateTime
     */
    public function getCreatedAt(): DateTime
    {
        return $this->createdAt;
    }

}
