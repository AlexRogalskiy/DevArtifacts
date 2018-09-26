<table class="table table-striped table-condensed table-bordered">
    <caption class="lead">Таблица Imgs</caption>
    <tr>
        <th>#id</th>
        <th>#id товара</th>
        <th>Путь</th>
        <th>#</th>
    </tr>
<?php foreach ($imgs as $item): ?>
    <tr>
        <td><?= $item['id']; ?></td>
        <td><?= $item['id_goods']; ?></td>
        <td><?= $item['img_path']; ?></td>
        
        <td><a href='<?= $_SERVER["PHP_SELF"] . "?del_imgs={$item['id']}" ?>'>Удалить</a></td>
    </tr>
<?php endforeach?>
</table>