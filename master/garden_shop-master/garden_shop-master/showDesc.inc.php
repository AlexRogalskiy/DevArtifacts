<div class="modal-body">
<?php 
    
    include_once('admin/func.inc.php');
    
    if(isset($_POST['desc_id'])) {
        $desc_id = $_POST['desc_id'];
        //echo $desc_id;        
    }   

?>

<?php if (isset($_POST['desc_id'])): ?>
<?php $desc_good = getDescItemFromGoodsAndImgs($_POST['desc_id']); ?>

<?php foreach ($desc_good as $item): ?>    
    
    <?php if (isset($item['img_path'])): ?>
        <img src="<?= $item['img_path']?>" width="350" height="250" />
      <?php endif?>
          
        <form action="" method="post">      
          <input type="hidden" name="quantity" value="1">
          <input type="hidden" name="id" value="<?= $item['id']; ?>">
          <input type="submit" value="" class="button_basket">
        </form>
  
      <p><?= $item['category']?></p>
      <p><?= $item['description']?></p>
   

<?php endforeach?>
<?php endif?>
</div>