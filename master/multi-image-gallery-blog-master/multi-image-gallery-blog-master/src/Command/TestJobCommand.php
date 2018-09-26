<?php

namespace App\Command;

use App\Service\JobQueueFactory;
use Symfony\Bundle\FrameworkBundle\Command\ContainerAwareCommand;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

class TestJobCommand extends ContainerAwareCommand
{
    /** @var  OutputInterface */
    private $output;

    protected function configure()
    {
        $this
            ->setName('app:test-jobs')
            ->addArgument(
                'mode',
                InputArgument::REQUIRED,
                'test worker mode (1 for worker, 2 for new task)'
            );
    }

    protected function execute(InputInterface $input, OutputInterface $output)
    {
        $this->output = $output;
        $mode = $input->getArgument('mode');

        if ($mode != 1 && $mode != 2) {
            throw new \Exception('Invalid mode, use 1 or 2');
        }

        if ($mode == 1) {
            $this->startWorker();
        }

        if ($mode == 2) {
            $this->generateTestJob();
        }
    }

    protected function startWorker()
    {
        $this->output->writeln('Starting a worker');

        $queue = $this->getContainer()
            ->get(JobQueueFactory::class)
            ->createQueue()
            ->watch('test');

        $job = $queue->reserve(60 * 5);

        if (false === $job) {
            $this->output->writeln('Timed out');

            return;
        }

        $jobPayload = $job->getData();
        $this->output->writeln("Got a new job: $jobPayload");
        $queue->delete($job);
    }

    protected function generateTestJob()
    {
        $queue = $this->getContainer()
            ->get(JobQueueFactory::class)
            ->createQueue()
            ->useTube('test');

        $jobPayload = sprintf("Job %s at %s", rand(), date('d.m.Y. H:i:s'));
        $queue->put($jobPayload);
        $this->output->writeln("Added a new job: $jobPayload");
    }
}
