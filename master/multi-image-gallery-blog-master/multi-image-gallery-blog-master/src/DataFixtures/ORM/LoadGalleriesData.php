<?php

namespace App\DataFixtures\ORM;

use App\Entity\Gallery;
use App\Entity\Image;
use App\Service\FileManager;
use App\Service\ImageResizer;
use Doctrine\Common\DataFixtures\AbstractFixture;
use Doctrine\Common\DataFixtures\OrderedFixtureInterface;
use Doctrine\Common\Persistence\ObjectManager;
use Faker\Factory;
use Ramsey\Uuid\Uuid;
use Symfony\Component\DependencyInjection\ContainerAwareInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;

class LoadGalleriesData extends AbstractFixture implements ContainerAwareInterface, OrderedFixtureInterface
{
    const COUNT = 100;

    /** @var  ContainerInterface */
    private $container;

    public function load(ObjectManager $manager)
    {
        $manager->getConnection()->getConfiguration()->setSQLLogger(null);
        $imageResizer = $this->container->get(ImageResizer::class);
        $fileManager = $this->container->get(FileManager::class);

        $faker = Factory::create();
        $batchSize = 100;

        for ($i = 1; $i <= self::COUNT; $i++) {
            $gallery = new Gallery(Uuid::getFactory()->uuid4());
            $gallery->setName($faker->sentence);

            $description = <<<MD
# {$faker->sentence()}

{$faker->realText()}
MD;


            $gallery->setDescription($description);
            $gallery->setUser($this->getReference('user' . (rand(1, LoadUsersData::COUNT))));
//            $this->addReference('gallery' . $i, $gallery);

            for ($j = 1; $j <= rand(5, 10); $j++) {
                $filename = $faker->word . '.jpg';
                $image = $this->generateRandomImage($filename);

                $description = <<<MD
# {$faker->sentence()}

{$faker->realText()}
MD;

                $image->setDescription($description);
                $gallery->addImage($image);
                $manager->persist($image);

                $fullPath = $fileManager->getFilePath($image->getFilename());
                if (false === empty($fullPath)) {
                    foreach ($imageResizer->getSupportedWidths() as $width) {
                        $imageResizer->getResizedPath($fullPath, $width, true);
                    }
                }
            }

            $manager->persist($gallery);

            if (($i % $batchSize) == 0 || $i == self::COUNT) {
                $currentMemoryUsage = round(memory_get_usage(true) / 1024 / 1024);
                $maxMemoryUsage = round(memory_get_peak_usage(true) / 1024 / 1024);
                echo sprintf("%s Memory usage (currently) %dMB / (max) %dMB\n",
                    $i,
                    $currentMemoryUsage,
                    $maxMemoryUsage
                );

                $manager->flush();
                $manager->clear();

                // here you should merge entities you're re-using with the $manager
                // because they aren't managed anymore after calling $manager->clear();
                // e.g. if you've already loaded category or tag entities
                // $category1 = $manager->merge($category1);

                gc_collect_cycles();
            }
        }

        $manager->flush();
    }


    private function generateRandomImage($imageName)
    {
        $images = [
            'image1.jpeg',
            'image10.jpeg',
            'image11.jpeg',
            'image12.jpg',
            'image13.jpeg',
            'image14.jpeg',
            'image15.jpeg',
            'image2.jpeg',
            'image3.jpeg',
            'image4.jpeg',
            'image5.jpeg',
            'image6.jpeg',
            'image7.jpeg',
            'image8.jpeg',
            'image9.jpeg',
        ];

        $sourceDirectory = $this->container->getParameter('kernel.project_dir') . '/var/demo-data/sample-images/';
        $targetDirectory = $this->container->getParameter('kernel.project_dir') . '/var/uploads/';

        $randomImage = $images[rand(0, count($images) - 1)];
        $randomImageSourceFilePath = $sourceDirectory . $randomImage;
        $randomImageExtension = explode('.', $randomImage)[1];
        $targetImageFilename = sha1(microtime() . rand()) . '.' . $randomImageExtension;
        copy($randomImageSourceFilePath, $targetDirectory . $targetImageFilename);

        $image = new Image(
            Uuid::getFactory()->uuid4(),
            $imageName,
            $targetImageFilename
        );

        return $image;
    }

    public function getOrder()
    {
        return 200;
    }

    public function setContainer(ContainerInterface $container = null)
    {
        $this->container = $container;
    }
}