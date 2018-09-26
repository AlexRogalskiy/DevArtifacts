<?php 
    session_start();

    include_once('admin/func.inc.php'); 
    
    // get catalog
    $catalog_goods = getItemsFromGoodsAndImgs();
    // get hit product
    $hit_goods = getItemsFromGoodsAndImgsForHit();
    

    if (!$catalog_goods) {
        $msg =  'Товаров нет';        
    }

    
    if (isset($_POST['id']) && isset($_POST['quantity'])) {        
        
        $id = clearInt($_POST['id']);
        $quantity = clearInt($_POST['quantity']);       
        
        if (addToBasket($id, $quantity)) {
            header('Location: index.php');
            exit;
        }        
    }

    
    if (isset($_GET['del'])) {
        $id = clearInt($_GET['del']);
        deleteItemFromBasket($id);
    }

    
    if (isset($_SESSION['basket'])) {        
        $sum = 0; // sum of all products
        $goods = getBasket();                       
    } 

    if (!isset($goods) || !is_array($goods)) {
        $basket_msg = 'Корзина пуста';
    }

    // mail function 
    if (!empty($_POST['client_name']) && !empty($_POST['client_email']) && !empty($_POST['client_phone'])) {
        $client_name = clearMailStr($_POST['client_name']);
        $client_email = clearMailStr($_POST['client_email']);
        $client_phone = clearMailStr($_POST['client_phone']);
        $delivery_type = clearMailStr($_POST['delivery_type']);        
        
        //$client_email .= ', dobriy_sad@mail.ru';
        
        include('send_message.inc.php');

        
        if (mail($client_email, $subject, $message, $headers)) {
            // erase basket
            unset($_SESSION['basket']);
            header('Location: index.php?send=true');
            exit;
        } 
    }

    
?>
<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Главная</title>    
    <link rel="stylesheet" href="css/foundation.css">
    <link rel="stylesheet" href="css/bootstrap.css">     
    <link rel="stylesheet" href="css/style.css">
    <link rel="stylesheet" href="css/jquery-ui-1.10.3.custom.css">    
    <script type="text/javascript" src="http://code.jquery.com/jquery-1.10.1.min.js"></script>
    <script type="text/javascript" src="js/foundation.min.js"></script>
    <script type="text/javascript" src="js/bootstrap.js"></script>    
    <script type="text/javascript" src="js/jquery-ui-1.10.3.custom.min.js"></script>   
</head>
<body>
    
    <!--  wrapper -->
    <div class="wrapper">        
        
        <!-- header -->
        <div class="header">           
            <!-- basket fixed position -->              
            <a href="#" data-reveal-id="modal_basket" data-animation="fade">
            <div class="basket">
                <p class="basket_msg">
                    <?php if (isset($basket_msg)) {
                        echo $basket_msg;
                    } else {
                        echo "Товаров: " . count($_SESSION['basket']) . " шт.";
                    }
                    ?>
                </p>
            </div>
            </a> 
            <!-- basket fixed position -->
            
            <div class="head"></div>
            
            <div class="name_logo">
                <img src="img/aksiya.png" class="bonus">
            </div>
            
            <div class="phone"></div>

            <div class="jingle">
                <a href="#modal_call_order" data-toggle="modal"><img src="img/zvonok.jpg"></a>
            </div>

            <div class="jingle_footer"></div>            
            
            <!-- hit sales -->
            <?php include('hit_product.inc.php'); ?>
            <!-- hit sales --> 

        </div>
        <!-- header -->

        <!-- content -->
        <div class="content">
            <div class="plus"></div>
            <div class="lights1vt"></div>
            
            <div class="products" id="chapter_1">                
                <?php 
                    if ($catalog_goods) {
                        include('showCatalog1vt.inc.php');
                    } 
                ?>
            </div>
            
            <div class="line3"></div>
            
            <div class="slider1"></div>           
            <div class="line1"></div>
            <div class="lights3vt"></div>

            <div class="products" id="chapter_2">
                <?php 
                    if ($catalog_goods) {
                        include('showCatalog3vt.inc.php');
                    } 
                ?>
            </div>

            <!--открыть все -->
            <div class="line3"></div>
            <div class="slider2"></div>
                        
            <div class="oplata"></div>
            <!-- how we work -->
            <div class="how_we_work"></div>
            <!-- how we work -->

            

            <div class="delivery">      
                <div class="opt_text_delivery">
                    <p>Мы осуществляем доставку наших товаров по всей России и странам СНГ почтой России и экспресс почтой EMS.
                    Стоимость и сроки доставки почтой России или EMS зависит от местонахождения вашего населённого пункта. 
                    Вы можете самостоятельно рассчитать стоимость доставки почтой России <a href="http://www.russianpost.ru/autotarif/SelautotarifRus.aspx">здесь</a></p>

                    <p>Доставки почтой EMS <a href="http://www.emspost.ru/ru/calc/">здесь</a></p>

                    <p>Внимание!
                    Отправка товара осуществляется после оплаты всей стоимости товара и стоимости почтовой отправки в ваш населённый пункт, в течение 3 рабочих дней.</p>

                    <p>Оплата при получении товара возможна при доставке курьером и самовывозе.</p>


                    <p>По городу Москве осуществляется доставка курьером.
                    Стоимость доставки:
                    - по центру города в пределах кольцевой линии метро - 300 рублей.
                    - от кольцевой линии метро до МКАД - 500 рублей.</p>

                    <p>Так же возможен самовывоз в Москве в районе м.Калужская.</p>

                    </p>При оформлении заказа укажите предпочтительный для вас способ доставки!</p>
                </div>                 
            </div>

            <!-- opt  -->
            <div class="opt">      
                <div class="opt_text">
                    Компания "Добрый сад" приглашает к сотрудничеству оптовиков. 
                    Мы предлагаем гибкую систему закупки по оптовым ценам от 30 000 рублей. 
                    Для получения информации по нашим партнёрским программам 
                    свяжитесь с нами по электронному адресу <a href="mailto:dobriy_sad@mail.ru">dobriy_sad@mail.ru</a> или по телефону +7 495 641-64-67
                </div>
                <div class="opt_logo"><img src="img/logo.png" alt="" width="111" height="98" /> 
                </div> 
            </div>
            <!-- opt  -->

            <div class="line4"></div>

            <div class="certificate">                 
                <a href="img/sf2.jpg" target="_blank" onClick="openWinForCert(this.href); return false"><img src="img/sf2.jpg" class="cert_1_pos"  width="201" height="296" /></a>
                <a href="img/sf2.jpg" target="_blank" onClick="openWinForCert(this.href); return false"><img src="img/sf2.jpg" class="cert_2_pos" width="201" height="296" /></a>
                <a href="img/sf2.jpg" target="_blank" onClick="openWinForCert(this.href); return false"><img src="img/sf2.jpg" class="cert_3_pos" width="201" height="296" /></a>
            </div>
            
            <div class="plus2"></div>
                   

        </div>
        <!-- content -->

        <!-- footer -->        
        <div class="footer">
            <div class="phone2"><!--<center>
                <a href="#" target="_blank" ><img src="img/mkt2.png" width="200" height="36" class="phone_link"></a></center>-->
            <a href="#modal_call_order" data-toggle="modal"><img src="img/zvonok2_link.png" class="jingle_footer_img"></a>
            </div> 
                <div class="foot_image"></div>           
        </div>            
        <!-- footer --> 
        
        
        <!-- modal basket -->
        <div id="modal_basket" class="reveal-modal">
            <?php if (isset($basket_msg)) echo "<p>{$basket_msg}</p>"?>
            <a class="close-reveal-modal" href="">Закрыть</a>
            <?php 
                    if (isset($goods) && !empty($goods)) {
                        include('showBasket.inc.php');
                    } 
            ?>
        </div>
        <!-- modal basket -->
        
        
        <!-- modal confirm -->
        <div id="modal_confirm" class="reveal-modal">
            <a class="close-reveal-modal" href="">Закрыть</a>            
            <?php include('order_form.inc.php');?>
        </div>
        <!-- modal confirm -->

        <!-- modal success -->  
        <?php 
            if ($_GET['send'] == true) {
                echo "<div id='overrideAlert'> </div>";                
            }
        ?> 
        <!-- modal success -->

        
        <!-- call order -->
        <div id="modal_call_order" class="modal hide fade" tabindex="-1" role="dialog" aria-labelledby="call_order_form" aria-hidden="true">
            <button type="button" class="close_call" data-dismiss="modal" aria-hidden="true">Закрыть</button>            
               <div> 
            <?php include('call_order_form.inc.php');?>
        </div>
        </div>
        <!-- call order -->
    
        <!-- product in detail-->
        <div id="in_detail" class="modal hide fade" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
                <button type="button" class="close" data-dismiss="modal" aria-hidden="true">Закрыть</button>               
                       
            <div id="ajax_div">
                <?php include('showDesc.inc.php'); ?>
            </div>           
        
        </div>
        <!-- product in detail-->

    </div>
    <!-- wrapper -->    
    
    <script type="text/javascript" src="js/scripts.js"></script>
</body>
</html>