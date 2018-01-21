<?php
require("./_connect.php");

$chatNameUnescaped=$_GET["chatName"];

$db = new mysqli($db_host, $db_user, $db_password, $db_name);

$chatName = htmlentities(mysqli_real_escape_string($db,$chatNameUnescaped));

if($db->connect_error) {
    echo "Connection failed: " . $db->connect_error;
}

$query="SELECT 1 FROM $chatName LIMIT 1;";



if($result=$db->query($query)) {
    echo "This chat already exists. Use 'Join Chat'";
}
else {
    $query2="CREATE TABLE $chatName LIKE template";
    
    $result2=$db->query($query2);
    
    echo "$chatName";
}

mysqli_close($db);
?>