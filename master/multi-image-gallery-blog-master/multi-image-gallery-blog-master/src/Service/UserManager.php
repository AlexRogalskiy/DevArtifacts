<?php

namespace App\Service;

use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\EntityRepository;
use Ramsey\Uuid\Uuid;
use Symfony\Component\EventDispatcher\EventDispatcherInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Session\SessionInterface;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;
use Symfony\Component\Security\Core\Authentication\Token\UsernamePasswordToken;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;
use Symfony\Component\Security\Http\Event\InteractiveLoginEvent;
use Symfony\Component\Security\Http\SecurityEvents;

class UserManager
{
    /** @var  UserPasswordEncoderInterface */
    private $encoder;

    /** @var  EntityManagerInterface */
    private $em;

    /** @var  EntityRepository */
    private $repository;

    /** @var  TokenStorageInterface */
    private $tokenStorage;

    /** @var  SessionInterface */
    private $session;

    /** @var  EventDispatcherInterface */
    private $eventDispatcher;

    public function __construct(
        UserPasswordEncoderInterface $encoder,
        EntityManagerInterface $em,
        TokenStorageInterface $tokenStorage,
        SessionInterface $session,
        EventDispatcherInterface $eventDispatcher
    ) {
        $this->encoder = $encoder;
        $this->em = $em;
        $this->repository = $em->getRepository(User::class);
        $this->tokenStorage = $tokenStorage;
        $this->session = $session;
        $this->eventDispatcher = $eventDispatcher;
    }

    public function getCurrentUser()
    {
        $token = $this->tokenStorage->getToken();

        if (empty($token)) {
            return null;
        }

        $user = $token->getUser();

        if (!($user instanceof User)) {
            return null;
        }

        return $user;
    }

    public function createUser()
    {
        $uuid = Uuid::getFactory()->uuid4();

        return new User($uuid);
    }

    public function update(User $user)
    {
        $password = $this->encoder->encodePassword($user, $user->getPlainPassword());
        $user->setPassword($password);
    }

    public function save(User $user)
    {
        $this->em->persist($user);
        $this->em->flush();
    }

    public function register(array $data)
    {
        $user = $this->createUser();
        $user->setEmail($data['email']);
        $user->setPlainPassword($data['password']);
        $this->update($user);
        $this->save($user);

        return $user;
    }

    public function login(User $user, Request $request)
    {
        $token = new UsernamePasswordToken($user, null, 'main', $user->getRoles());
        $this->tokenStorage->setToken($token);
        $this->session->set('_security_main', serialize($token));
        $event = new InteractiveLoginEvent($request, $token);
        $this->eventDispatcher->dispatch(SecurityEvents::INTERACTIVE_LOGIN, $event);
    }

    public function findByEmail($email)
    {
        return $this->repository->findOneBy(['email' => $email]);
    }

}
