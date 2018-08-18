var $window = $(window);
    
$window.scroll(function(){
  var $document = $(document),
  	  scrollPosition = $window.scrollTop(),
      $header = $document.find('.header'),
      headerHeight = $header.height(),
      $progressBar = $('.progress-bar');
  $('.article-body').each(function(){
    var $this = $(this),
        articlePositionTop = $this.offset().top,
        articleHeight = $this.height(),
        articlePostionBottom = articlePositionTop + articleHeight,
        articleTitle = $this.find('h2').text(),
        nextArticleTitle = $this.next('.article-body').find('h2').text(),
        $currentArticle = $document.find('.current-article'),
        $nextArticle = $document.find('.next-article');
    	if (articlePositionTop <= scrollPosition && articlePostionBottom >= scrollPosition) {
        var $articlePartial = $document.find('.article-partial');
        $progressBar.removeClass('is-hidden');
        $articlePartial.removeClass('is-hidden');
        $currentArticle.text(articleTitle);
        $nextArticle.text(nextArticleTitle);
        console.log();
        $progressBar.val(scrollPosition - articlePositionTop).attr('max', articleHeight);
      }
  });
  if (scrollPosition < headerHeight) {
     $progressBar.addClass('is-hidden');
     $articlePartial.addClass('is-hidden');
  }
});
