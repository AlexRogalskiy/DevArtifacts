<?php

namespace App\Command;

use App\Entity\Gallery;
use App\Service\FileManager;
use App\Service\ImageResizer;
use Symfony\Bundle\FrameworkBundle\Command\ContainerAwareCommand;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

class GenerateGalleryImageThumbnailsCommand extends ContainerAwareCommand
{
    /** @var  OutputInterface */
    private $output;

    protected function configure()
    {
        $this->setName('app:generate-gallery-thumbs')
            ->addArgument('id', InputArgument::REQUIRED);
    }

    protected function execute(InputInterface $input, OutputInterface $output)
    {
        $id = $input->getArgument('id');

        /** @var Gallery $gallery */
        $gallery = $this->getContainer()->get('doctrine')->getRepository(Gallery::class)->find($id);
        if (empty($gallery)) {
            throw new \Exception('Gallery not found');
        }

        $imageResizer = $this->getContainer()->get(ImageResizer::class);
        $fileManager = $this->getContainer()->get(FileManager::class);

        foreach ($gallery->getImages() as $image) {
            $fullPath = $fileManager->getFilePath($image->getFilename());
            if (empty($fullPath)) {
                $output->writeln("Full path for image with ID {$image->getId()} is empty");
                continue;
            }

            $cachedPaths = [];
            foreach ($imageResizer->getSupportedWidths() as $width) {
                $cachedPaths[$width] = $imageResizer->getResizedPath($fullPath, $width, true);
            }
            $output->writeln("Thumbnails generated for image {$image->getId()}");
            $output->writeln(json_encode($cachedPaths, JSON_PRETTY_PRINT));
        }

    }
}
