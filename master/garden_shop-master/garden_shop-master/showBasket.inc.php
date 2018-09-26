<table class="table table-striped" id="basket_table">    
    <tr>
        <th>№</th>
        <th>Товар</th>
        <th>Категория</th>        
        <th>Количество</th> 
        <th>Цена</th>        
        <th>#</th>       
    </tr>
<?php $counter = 1; ?>
<?php foreach ($goods as $item): ?>

    <tr>
        <td><?= $counter++; ?></td>
        <td>
            <?php if (isset($item['img_path'])): ?>
                <img src="<?= $item['img_path']?>" width="54" height="50" />
            <?php endif?>
        </td>
        <td><?= $item['category']; ?></td>        
        <td><input type="text" size="1" value="<?= $item['quantity']; ?>" class="calc_quantity" onkeypress='validate(event)'></td>
        <td class="price_for_count"><?= $item['price']; ?></td>       
        
        <td><a href='<?= $_SERVER["PHP_SELF"] . "?del={$item['id']}" ?>'>Удалить</a></td>
        
        <?php $sum += $item['price'] * $item['quantity']; ?>
    </tr>    
<?php endforeach?>
</table>
<p>Cумма:<strong> <span id="total_sum"><?= $sum; ?></span></strong> руб.</p>


<p><a href="#" data-reveal-id="modal_confirm" data-animation="fade"><img src="img/confirm_order.png" id="confirm_form"></a></p>