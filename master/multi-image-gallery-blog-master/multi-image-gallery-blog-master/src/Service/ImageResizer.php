<?php

namespace App\Service;

use League\Glide;

class ImageResizer
{
    private $server;

    const SIZE_1120 = 1120;
    const SIZE_720 = 720;
    const SIZE_400 = 400;
    const SIZE_250 = 250;

    const CACHE_DIR = 'cache';

    public function __construct(FileManager $fm)
    {
        $this->server = $server = Glide\ServerFactory::create([
            'source' => $fm->getUploadsDirectory(),
            'cache'  => $fm->getUploadsDirectory() . '/' . self::CACHE_DIR,
        ]);
    }

    private function getGlide()
    {
        return $this->server;
    }

    public function getSupportedWidths()
    {
        return [
            self::SIZE_1120,
            self::SIZE_720,
            self::SIZE_400,
            self::SIZE_250,
        ];
    }

    public function isSupportedSize(int $size)
    {
        return in_array($size, $this->getSupportedWidths());
    }

    public function getResizedPath(string $fullPath, int $size, $resizeIfDoesntExist = false)
    {
        if (false === is_readable($fullPath)) {
            throw new \Exception();
        }

        if (false === $this->isSupportedSize($size)) {
            throw new \Exception();
        }

        $info = pathinfo($fullPath);
        $fileName = $info['filename'] . '.' . $info['extension'];

        $params = ['w' => $size];

        $cacheFileExists = $this->getGlide()->cacheFileExists($fileName, $params);

        if (true === $cacheFileExists) {
            $cachePath = $this->getGlide()->getCachePath($fileName, $params);
            $cachePath = sprintf("/%s/%s", self::CACHE_DIR, $cachePath);
            $filePath = str_replace($fileName, $cachePath, $fullPath);

            return $filePath;
        }

        if (true === $resizeIfDoesntExist) {
            $cachePath = $this->getGlide()->makeImage($fileName, $params);
            $cachePath = sprintf("/%s/%s", self::CACHE_DIR, $cachePath);
            $filePath = str_replace($fileName, $cachePath, $fullPath);

            return $filePath;
        }

        return null;
    }

}
