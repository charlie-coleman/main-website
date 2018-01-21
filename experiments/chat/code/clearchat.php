<?php
    require("./_connect.php");


    $db = new mysqli($db_host, $db_user, $db_password, $db_name);
    if($df->connect_errno) {
        echo "Failed to connect to MySQL: (" . $db->connect_errno . ") " . $db_connect_error;
    }
    
    $userName=$_GET["un"];
    $userPW=$_GET["pw"];
    $chat=$_GET["chatName"];

    if($userName == $db_user && $userPW == $db_password) {
        $query = "TRUNCATE TABLE $chat;";
        if($db->real_query($query)) {
            echo "Cleared";
        }
        else {
            echo "An error occurred";
            echo $db->errno;
        }
    }
    else {
        echo "Incorrect username or password";
    }
?>