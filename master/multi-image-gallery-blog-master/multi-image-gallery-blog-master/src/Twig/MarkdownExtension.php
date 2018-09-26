<?php

namespace App\Twig;

use Parsedown;
use Twig_Extension;
use Twig_SimpleFilter;

class MarkdownExtension extends Twig_Extension
{

    public function getFilters()
    {
        return [
            new Twig_SimpleFilter('markdown', [$this, 'renderMarkdownToHtml']),
        ];
    }

    public function renderMarkdownToHtml($markdown)
    {
        $parsedown = new Parsedown();

        return $parsedown->text($markdown);
    }

}
