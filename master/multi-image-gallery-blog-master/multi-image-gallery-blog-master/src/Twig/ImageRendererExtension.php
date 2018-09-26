<?php

namespace App\Twig;

use App\Entity\Image;
use App\Service\ImageResizer;
use Symfony\Component\Routing\RouterInterface;
use Twig_Extension;
use Twig_SimpleFilter;


class ImageRendererExtension extends Twig_Extension
{
    /** @var  RouterInterface */
    private $router;

    public function __construct(RouterInterface $router)
    {
        $this->router = $router;
    }

    public function getFilters()
    {
        return [
            new Twig_SimpleFilter('getImageUrl', [$this, 'getImageUrl']),
            new Twig_SimpleFilter('getImageSrcset', [$this, 'getImageSrcset']),
        ];
    }

    public function getImageUrl(Image $image, $size = null)
    {
        return $this->router->generate('image.serve', [
            'id' => $image->getId() . (($size) ? '--' . $size : ''),
        ], RouterInterface::ABSOLUTE_URL);
    }


    public function getImageSrcset(Image $image)
    {
        $sizes = [
            ImageResizer::SIZE_1120,
            ImageResizer::SIZE_720,
            ImageResizer::SIZE_400,
            ImageResizer::SIZE_250,
        ];

        $string = '';
        foreach ($sizes as $size) {
            $string .= $this->router->generate('image.serve', [
                    'id' => $image->getId() . '--' . $size,
                ], RouterInterface::ABSOLUTE_URL) . ' ' . $size . 'w, ';
        }
        $string = trim($string, ', ');

        return html_entity_decode($string);
    }

}