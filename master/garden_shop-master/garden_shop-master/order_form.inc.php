<h3>Оформление заказа</h3>
<hr>
<form action="<?= $_SERVER['PHP_SELF']; ?>" method="post">
	<input type="text" placeholder="Имя.." name="client_name"><br>
	<input type="text" placeholder="E-mail.." name="client_email"><br>
	<input type="text" placeholder="Телефон.." name="client_phone"><br>
	<label class="delivery_string">Способ доставки:</label><br>
	<select name="delivery_type">
        <option value="самовывоз">самовывоз</option>
        <option value="курьером по Москве">курьером по Москве</option>
        <option value="почта России">почта России</option>EMS
        <option value="EMS">EMS</option>                  
    </select>
    <br>
	<input type="hidden" name="total_price" value="" id="to_send_total_sum">
	<input type="hidden" name="quantity_string" value="" id="to_send_quantity">
	<input type="submit" value="" name="order_form" class="order_form" id="order_form_success">
</form>