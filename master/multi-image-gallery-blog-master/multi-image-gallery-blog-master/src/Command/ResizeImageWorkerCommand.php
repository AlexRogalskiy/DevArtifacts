<?php

namespace App\Command;

use App\Entity\Image;
use App\Service\FileManager;
use App\Service\ImageResizer;
use App\Service\JobQueueFactory;
use Symfony\Bundle\FrameworkBundle\Command\ContainerAwareCommand;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

class ResizeImageWorkerCommand extends ContainerAwareCommand
{
    /** @var  OutputInterface */
    private $output;

    protected function configure()
    {
        $this->setName('app:resize-image-worker');
    }

    protected function execute(InputInterface $input, OutputInterface $output)
    {
        $this->output = $output;
        $output->writeln(sprintf('Started worker'));

        $queue = $this->getContainer()
            ->get(JobQueueFactory::class)
            ->createQueue()
            ->watch(JobQueueFactory::QUEUE_IMAGE_RESIZE);

        $job = $queue->reserve(60 * 5);

        if (false === $job) {
            $this->output->writeln('Timed out');

            return;
        }

        try {
            $this->resizeImage($job->getData());
            $queue->delete($job);
        } catch (\Exception $e) {
            $queue->bury($job);
            throw $e;
        }
    }

    protected function resizeImage(string $imageId)
    {
        /** @var Image $image */
        $image = $this->getContainer()->get('doctrine')
            ->getManager()
            ->getRepository(Image::class)
            ->find($imageId);

        if (empty($image)) {
            $this->output->writeln("Image with ID $imageId not found");
        }

        $imageResizer = $this->getContainer()->get(ImageResizer::class);
        $fileManager = $this->getContainer()->get(FileManager::class);

        $fullPath = $fileManager->getFilePath($image->getFilename());
        if (empty($fullPath)) {
            $this->output->writeln("Full path for image with ID $imageId is empty");

            return;
        }

        $cachedPaths = [];
        foreach ($imageResizer->getSupportedWidths() as $width) {
            $cachedPaths[$width] = $imageResizer->getResizedPath($fullPath, $width, true);
        }

        $this->output->writeln("Thumbnails generated for image $imageId");
        $this->output->writeln(json_encode($cachedPaths, JSON_PRETTY_PRINT));
    }
}
