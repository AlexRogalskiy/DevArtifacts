<div class="hit_sales">
    <div class="hit_left_side"></div>
    <div class="hit_right_side"></div>
    <div class="hit_top"></div>                
    
    <?php foreach ($hit_goods as $item): ?>
        <?php if ($item['hit'] == 1): ?>
        <div class="hit_border">
            
            <?php if (isset($item['img_path'])): ?>
                <img src="<?= $item['img_path']?>" class="hit_photo"></div>
            <?php else:?>
            <img src="" class="hit_photo"></div>
            <?php endif?>
        
        <div class="hit_bonus">
            <p class="hit_category"><?= $item['category'] ?></p>
            <p class="hit_price"> <?= $item['price'] ?> <span class="hit_price_currency">руб.</span></p>
        </div>
        
        <?php endif?>
    <?php endforeach?>
    
    <div class="hit_center"></div>
    <div class="hit_button">
        <form action="" method="post">      
          <input type="hidden" name="quantity" value="1">
          <input type="hidden" name="id" value="<?= $item['id']; ?>">
          <input type="submit" value="" class="hit_button_submit">
        </form>
    </div>
    <div class="hit_footer"></div>                 
</div>