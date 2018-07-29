# Custom Modal

```html
<!-- Styles -->
<style>
  .custom--overlay {
    z-index: 10000;
    position: fixed;
    top: 0;
    left: 0;
    display: none;
    background: rgba(0,0,0,0.8);
    width: 100%;
    height: 100%;
  }

  .custom--overlay.visible {
    display: block;
  }

  .custom--modal {
    z-index: 15000;
    position: fixed;
    top: 50%;
    left: 50%;
    display: none;
    background: #FFF;
    box-shadow: 0 0 15px rgba(0,0,0,0.2);
    width: 480px;
    height: 400px;
    transform: translate(-50%, -50%);
  }

  .custom--modal.visible {
    display: block;
  }
</style>

<!-- Trigger -->
<button class='custom--trigger'>
  Modal Trigger
</button>

<!-- Overlay -->
<div class='custom--overlay'></div>

<!-- Custom Modal -->
<div class='custom--modal'>
</div>

<!-- Scripts -->
<script>
  jQuery(document).ready(function($){
    var customTrigger = $('.custom--trigger'),
      customOverlay = $('.custom--overlay'),
      customModal = $('.custom--modal');

    function overlayRemove() {
      customOverlay.on('click', function() {
        $(this).fadeOut(300, 'swing').removeClass('visible');

        customModal.fadeOut(300, 'swing').removeClass('visible');
      });
    }

    customTrigger.on('click', function(e) {
      e.preventDefault();

      customOverlay.fadeIn(300, 'swing').addClass('visible');

      customModal.fadeIn(300, 'swing').addClass('visible');

      overlayRemove();
    });
  });
</script>
```