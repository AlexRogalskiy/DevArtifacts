<?php foreach ($catalog_goods as $item): ?>
    <?php if($item['visible'] == 1 && $item['section'] == 3): ?>
    
<div class="product">
  
  <div class="category">
    <div class="category_image">
      <div class="category_name"><?= $item['category']; ?></div>
    </div>    
  </div>

  
  <div class="block1" style=" height: 391px; width: 226px;">
  
 <div class="big_block">
 
 <div class="product_big_image">
      <?php if (isset($item['img_path'])): ?>
        <a href="#in_detail" data-desc-id="<?= $item['id']?>" class="desc_link" data-toggle="modal"><img src="<?= $item['img_path']?>" width="204" height="193" id="<?= $item['id']?>"></a>
      <?php endif?> 
</div> 
 </div> 
<!-- small images --> 
<?php $small_imgs = getSmallImgs($item['id']); ?>

 <?php if(isset($small_imgs) && !empty($small_imgs)):  ?>
 <?php foreach($small_imgs as $small_img): ?>
 
 <div class="small_block">
   <div class="product_prev_image">
    <!--<?php if (isset($item['img_path'])): ?>-->
      <a href="<?= $small_img['img_path']?>" onClick="changeImage(this.href, <?= $small_img['id_goods']?>); return false"><img src="<?= $small_img['img_path']?>" width="54" height="50" id="<?= $small_img['id_goods']?>"></a>
    <!--<?php endif?>--> 
   </div>   
  </div>

<?php endforeach?>
  <?php endif?>
 <!-- small images -->

  <div class="price">
    <form action="" method="post" id="desc_form">
      <input type="hidden" name="desc_id" value="<?= $item['id']?>">
    </form>   
   <a href="#in_detail" data-desc-id="<?= $item['id']?>" class="desc_link" data-toggle="modal">Подробно</a>    
   <br><span><?= $item['price']; ?> руб.</span>
  </div>

  <div class="">  
    <form action="" method="post">      
      <input type="hidden" name="quantity" value="1">
      <input type="hidden" name="id" value="<?= $item['id']; ?>">
      <input type="submit" value="" class="button_basket">
    </form>
  </div>
</div>
</div>
    <?php endif?>
<?php endforeach?>