<?php    
    session_start();    
    
    require('func.inc.php');          
    
    if (!isLoggedIn()) {
        header('Location: index.php');
        exit;
    }

    
    // add item to Db
    if (isset($_POST['addToDb'])) {

         $category = clearStr($_POST['category']);
         $description = clearStr($_POST['description']);
         $price = clearFloat($_POST['price']);
         $section = clearInt($_POST['section']);

        if (!addItemToDb($category, $description, $price, $section)) {
            $error = 'Произошла ошибка при добавлении товара в каталог';
        } else {             
             header('location: admin.php');
             exit;
        } 
    }

    
    // upload file
    if (isset($_POST['uploadSubmit']) && isset($_FILES['file_upload']) && isset($_POST['add'])) {
                
        $id = clearInt($_POST['add']);        
            
        if ($path = moveUploadedFile('file_upload')) { 
            $res = addImagePath($id, $path);
            header('location: admin.php');
            exit;
        }        
    } 


    // delete item from goods table
    if (isset($_GET['del_goods'])) {
        $id = clearInt($_GET['del_goods']);
        deleteItemFromGoods($id);
    }


    // delete item from imgs table
    if (isset($_GET['del_imgs'])) {
        $id = clearInt($_GET['del_imgs']);
        deleteItemFromImgs($id);
    }


    // swap item flag
    if (isset($_GET['swap']) && isset($_GET['visible'])) {
        
        $swap = clearInt($_GET['swap']);
        $id = clearInt($_GET['visible']);
        
        $swap = $swap ? 0 : 1;
        showHideItem($id, $swap);
    }

    // set or unset hit product
    if (isset($_GET['hit']) && isset($_GET['hit_id'])) {
        
        $hit = clearInt($_GET['hit']);
        $id = clearInt($_GET['hit_id']);
        
        $hit = $hit ? 0 : 1;
        SetUnsetHit($id, $hit);
    }

    // get goods and imgs
    $goods = getItemsFromGoods();
    $imgs = getItemsFromImgs(); 
?>
<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Admin Page</title>
    <link rel="stylesheet" href="../css/bootstrap/css/bootstrap.css">
</head>
<body>
    <div class="row" style="margin: 20px 50px;">
        <div class="span5">
            
            <h2>Добавить товар</h2>
            
            <p><?php if (isset($error)) echo $error; ?></p>
            
            <form action="<?= $_SERVER['PHP_SELF']; ?>" method="post">
                <input type="text" name="category" placeholder="категория.."><br>
                <textarea rows="5" cols="30" name="description" placeholder="описание товара.."></textarea><br>
                <select name="section">
                  <option value="1">1 Вт</option>
                  <option value="3">3 Вт</option>                  
                </select><br>
                <div class="input-prepend input-append">
                    <input type="text" class="input-small" name="price" placeholder="цена..">
                    <span class="add-on">руб.</span>
                </div><br>
                <input type="submit" value="добавить" class="btn btn-primary" name="addToDb">
            </form>  

        </div>
        <div class="">           
            <?php 
                if (isset($goods) && !empty($goods)) {
                    include('getItemsFromGoods.inc.php');
                }
            ?>
                           
        </div>
        <div class="container">
            <?php 
                if (isset($imgs) && !empty($imgs)) {
                    include('getItemsFromImgs.inc.php');
                } 
            ?> 
        </div>
    </div>    
</body>
</html>