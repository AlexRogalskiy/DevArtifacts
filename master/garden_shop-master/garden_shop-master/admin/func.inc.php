<?php
    
    // db connection
    require('db.inc.php');    

    // ######## General functions ##############
    // #########################################
    
    function clearInt($data) {
        return abs((int)$data);
    }

    
    function clearFloat($data) {
        return abs((float)$data);
    }


    function clearStr($data) {        
        global $link;
        return mysqli_real_escape_string($link, trim(strip_tags($data)));
    }

    function clearMailStr($data) {
        return trim(strip_tags($data));
    }


    function moveUploadedFile($file) {
        $tmp_file = $_FILES[$file]['tmp_name'];
        $target_file = basename($_FILES[$file]['name']);
        $upload_dir = UPLOAD_DIR; // set in db.inc.php
        $path = $upload_dir . $target_file;
        $path_to_table = 'img/uploads/' . $target_file;
        
        if (move_uploaded_file($tmp_file, $path)) {
            return $path_to_table;
            //return $path;
        }
        return false;    
    }


    // ######## Session functions ###########
    // ######################################

    function addToBasket($id, $quantity) {
        return $_SESSION['basket'][$id] = $quantity;        
    }


    function getBasket() {
        global $link; 
        
        // ids string keys 
        $ids = implode(",", array_keys($_SESSION['basket']));

        $sql = "SELECT g.id, img_path, category, description, price FROM goods AS g
                            LEFT JOIN imgs AS i ON g.id = i.id_goods WHERE g.id IN ($ids) GROUP BY g.id";        

        if (!$result = mysqli_query($link, $sql)) {
            return false;
        }

        $items = resultToArray($result);
        mysqli_free_result($result);
        return $items;
    }


    // к массиву result добавляем элемент quantity из массива $_SESSION[basket][id]
    function resultToArray($data) {
        $arr = array();

        while ($row = mysqli_fetch_assoc($data)) {
            $row['quantity'] = $_SESSION['basket'][$row['id']];
            $arr[] = $row; 
        }

        return $arr;
    }

    // delete element from $_SESSION['basket'][$id]
    function deleteItemFromBasket($id) {
        unset($_SESSION['basket'][$id]);
    } 

    
    // ######## Auth functions ##############
    // ###################################### 
    
    // is login ?
    function isLoggedIn() {
        return isset($_SESSION['user']);
    }

    
    // validate user
    function validUser($user, $passwd) {
        return ($user === USER && $passwd === PASSWD);
    }    
    

    // ######## Database functions ##############
    // ##########################################    
    
    // add item to db
    function addItemToDb($category, $description, $price, $section) {
        global $link;
        $sql = 'INSERT INTO goods (category, description, price, visible, section)
                                    VALUES (?, ?, ?, ?, ?)';
        
        $visible = 1;                        
        
        if (!$stmt = mysqli_prepare($link, $sql)) {
            return false;
        }
        
        mysqli_stmt_bind_param($stmt, 'ssdii', $category, $description, $price, $visible, $section);
        mysqli_stmt_execute($stmt);
        mysqli_stmt_close($stmt);
        return true;
    }


    // get all items from goods table
    function getItemsFromGoods() {        
        global $link;
        $sql = 'SELECT id, category, description, price, visible, section, hit FROM goods';

        if (!$result = mysqli_query($link, $sql)) {
            return false;
        } else {
            $items = mysqli_fetch_all($result, MYSQLI_ASSOC);
            //$items = mysqli_fetch_assoc($result);            
            
            mysqli_free_result($result);
            return $items;
        }
    }


    // get all items from imgs table
    function getItemsFromImgs() {        
        global $link;
        $sql = 'SELECT id, id_goods, img_path FROM imgs ORDER BY id';

        if (!$result = mysqli_query($link, $sql)) {
            return false;
        } else {
            $items = mysqli_fetch_all($result, MYSQLI_ASSOC);
            //$items = mysqli_fetch_assoc($result);            
            
            mysqli_free_result($result);
            return $items;
        }
    }


    // get all items from goods and imgs table
    function getItemsFromGoodsAndImgs() {        
        global $link;
        $sql = 'SELECT g.id, img_path, category, description, price, visible, section, hit FROM goods AS g
                LEFT JOIN imgs AS i ON g.id = i.id_goods GROUP BY g.id';

        if (!$result = mysqli_query($link, $sql)) {
            return false;
        } else {
            $items = mysqli_fetch_all($result, MYSQLI_ASSOC);
            //$items = mysqli_fetch_assoc($result);            
            
            mysqli_free_result($result);
            return $items;
        }
    }

    // get items from goods and imgs table for hit block
    function getItemsFromGoodsAndImgsForHit() {        
        global $link;
        $sql = 'SELECT g.id, img_path, category, description, price, visible, section, hit FROM goods AS g
                LEFT JOIN imgs AS i ON g.id = i.id_goods WHERE hit = 1 GROUP BY g.id LIMIT 1';

        if (!$result = mysqli_query($link, $sql)) {
            return false;
        } else {
            $items = mysqli_fetch_all($result, MYSQLI_ASSOC);
            //$items = mysqli_fetch_assoc($result);            
            
            mysqli_free_result($result);
            return $items;
        }
    }

    
    // get small images
    function getSmallImgs($id) {
        global $link;
        $sql = "SELECT id, id_goods, img_path FROM imgs WHERE id_goods = {$id} ORDER BY id DESC LIMIT 3";

        if (!$result = mysqli_query($link, $sql)) {
            return false;
        } else {
            $items = mysqli_fetch_all($result, MYSQLI_ASSOC);
            //$items = mysqli_fetch_assoc($result);            
            
            mysqli_free_result($result);
            return $items;
        }

    }


    // get one item from goods and imgs table for full description
    function getDescItemFromGoodsAndImgs($id) {        
        global $link;
        $sql = "SELECT g.id, img_path, category, description, price, visible FROM goods AS g
                LEFT JOIN imgs AS i ON g.id = i.id_goods WHERE g.id = {$id} GROUP BY g.id";

        if (!$result = mysqli_query($link, $sql)) {
            return false;
        } else {
            $items = mysqli_fetch_all($result, MYSQLI_ASSOC);
            //$items = mysqli_fetch_assoc($result);            
            
            mysqli_free_result($result);
            return $items;
        }
    }

    
    // delete item from goods table
    function deleteItemFromGoods($id) {
    	global $link;
    	$sql = "DELETE FROM goods WHERE id = {$id}";
    	
    	if (mysqli_query($link, $sql)) {
    		return true;
    	}
    	return false;
    }

    
    // delete item from imgs table
    function deleteItemFromImgs($id) {
        global $link;
        $sql = "DELETE FROM imgs WHERE id = {$id}";
        
        if (mysqli_query($link, $sql)) {
            return true;
        }
        return false;
    }

    
    // show or hide item
    function showHideItem($id, $flag) {
    	global $link;
    	$sql = "UPDATE goods SET visible = {$flag} WHERE id = {$id}";

    	if (mysqli_query($link, $sql)) {
    		return true;
    	}
    	return false;
    }


     // set or unset hit
    function SetUnsetHit($id, $flag) {
        global $link;
        $sql = "UPDATE goods SET hit = {$flag} WHERE id = {$id}";

        if (mysqli_query($link, $sql)) {
            return true;
        }
        return false;
    }


    // add image path and id_good to imgs table
    function addImagePath($id_good, $path) {
        global $link;
        $sql = 'INSERT INTO imgs (id_goods, img_path) 
                        VALUES(?, ?)';                           
        
        if (!$stmt = mysqli_prepare($link, $sql)) {
            return false;
        }
        
        mysqli_stmt_bind_param($stmt, 'is', $id_good, $path);
        mysqli_stmt_execute($stmt);
        mysqli_stmt_close($stmt);
        return true;
    }