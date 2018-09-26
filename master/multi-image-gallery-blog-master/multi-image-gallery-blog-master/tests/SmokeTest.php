<?php

namespace App\Tests;

use App\Entity\Gallery;
use Psr\Container\ContainerInterface;
use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;
use Symfony\Component\Routing\RouterInterface;

class SmokeTest extends WebTestCase
{
    /** @var  ContainerInterface */
    private $container;

    /**
     * @dataProvider urlProvider
     */
    public function testPageIsSuccessful($url)
    {
        $client = self::createClient();
        $client->request('GET', $url);

        $this->assertTrue($client->getResponse()->isSuccessful());
    }

    public function urlProvider()
    {
        $client = self::createClient();
        $this->container = $client->getContainer();

        $urls = [
            ['/'],
        ];

        $urls += $this->getGalleriesUrls();

        return $urls;
    }

    private function getGalleriesUrls()
    {
        $router = $this->container->get('router');
        $doctrine = $this->container->get('doctrine');
        $galleries = $doctrine->getRepository(Gallery::class)->findBy([], null, 5);

        $urls = [];

        /** @var Gallery $gallery */
        foreach ($galleries as $gallery) {
            $urls[] = [
                '/' . $router->generate('gallery.single-gallery', ['id' => $gallery->getId()],
                    RouterInterface::RELATIVE_PATH),
            ];
        }

        return $urls;
    }

}
