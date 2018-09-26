<?php

namespace App\Service;

use InvalidArgumentException;
use Symfony\Component\HttpFoundation\File\UploadedFile;

class FileManager
{
    private $path;

    public function __construct($path)
    {
        if (!is_dir($path)) {
            throw new InvalidArgumentException(sprintf('Target directory %s doesn\'t exist', $path));
        }

        $this->path = $path;
    }

    public function getUploadsDirectory()
    {
        return $this->path;
    }

    public function upload(UploadedFile $file, $filename)
    {
        $file = $file->move($this->getUploadsDirectory(), $filename);

        return $file;
    }

    public function getFilePath($filename)
    {
        return $this->getUploadsDirectory() . DIRECTORY_SEPARATOR . $filename;
    }

    public function getPlaceholderImagePath()
    {
        return $this->getUploadsDirectory() . '/../placeholder.jpg';
    }

}
