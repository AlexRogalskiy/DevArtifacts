<table class="table table-striped table-condensed table-bordered">
    <caption class="lead">Таблица Goods</caption>
	<tr class="info">
        <th class="span1">#id</th>
        <th class="span1">Категория</th>
        <th class="span12">Описание</th>
        <th class="span1">Цена</th>
        <th class="span2">Раздел (Вт)</th>
        <th class="span1">Хит</th>
        <th class="span1">#</th>
        <th class="span1">Видимость</th>
        <th class="span1">#</th>
        <th class="span1">Изображение</th>
        <th class="span1">#</th>
    </tr>
<?php foreach ($goods as $item): ?>
    <tr>
	    <td><?= $item['id']; ?></td>
	    <td><?= $item['category']; ?></td>
	    <td><?= $item['description']; ?></td>
	    <td><?= $item['price']; ?></td>
        <td><?= $item['section']; ?></td>
        <td><?= $item['hit']; ?></td>
        <td><a href='<?= $_SERVER["PHP_SELF"] . "?hit={$item['hit']}&hit_id={$item['id']}" ?>'>
            <?= $item['hit'] ?  'Снять' : 'Хит'; ?></a>
        </td> 
	    <td><?= $item['visible']; ?></td>                
	    
	    <td><a href='<?= $_SERVER["PHP_SELF"] . "?swap={$item['visible']}&visible={$item['id']}" ?>'>
	    	<?= $item['visible'] ? 'Скрыть' : 'Показать'; ?></a>
	    </td>

        <td>
            <form action="<?= $_SERVER['PHP_SELF']; ?>" method="post" enctype="multipart/form-data">
                <input type="hidden" name="add" value="<?= $item['id']; ?>">
                <input type="file" name="file_upload"><br>
                <input type="submit" name="uploadSubmit" value="Добавить Картинку" class="btn btn-link">
            </form>            
        </td>
	    
	    <td><a href='<?= $_SERVER["PHP_SELF"] . "?del_goods={$item['id']}" ?>'>Удалить</a></td>
    </tr>
<?php endforeach?>
</table>