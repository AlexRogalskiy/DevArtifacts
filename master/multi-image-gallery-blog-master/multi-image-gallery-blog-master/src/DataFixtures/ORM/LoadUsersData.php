<?php

namespace App\DataFixtures\ORM;

use App\Service\UserManager;
use Doctrine\Common\DataFixtures\AbstractFixture;
use Doctrine\Common\DataFixtures\OrderedFixtureInterface;
use Doctrine\Common\Persistence\ObjectManager;
use Symfony\Component\DependencyInjection\ContainerAwareInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;

class LoadUsersData extends AbstractFixture implements ContainerAwareInterface, OrderedFixtureInterface
{
    const COUNT = 500;

    /** @var  ContainerInterface */
    private $container;

    public function load(ObjectManager $manager)
    {
        /** @var UserManager $userManager */
        $userManager = $this->container->get(UserManager::class);
        $batchSize = 300;

        $encoder = $this->container->get('security.password_encoder');
        $user = $userManager->createUser();
        $encodedPassword = $encoder->encodePassword($user, '123456');

        for ($i = 1; $i <= self::COUNT; $i++) {
            $user = $userManager->createUser();
            $user->setEmail(sprintf('user%s@mailinator.com', $i));
            $user->setRoles(['ROLE_USER']);
            $user->setPassword($encodedPassword);
//            $userManager->update($user);
            $manager->persist($user);
            $this->addReference('user' . $i, $user);

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

                gc_collect_cycles();
            }

        }

        $manager->flush();
    }

    public function getOrder()
    {
        return 100;
    }

    public function setContainer(ContainerInterface $container = null)
    {
        $this->container = $container;
    }
}