<?php
require("./_connect.php");

$chat=$_GET["chatName"];

$db = new mysqli($db_host, $db_user, $db_password, $db_name);

if($db->connect_error) {
    echo "Connection failed: " . $db->connect_error;
}

$query="SELECT 1 FROM $chat LIMIT 1;";


if($result=$db->query($query)) {
    echo "Table exists.";
}
else {
    echo "This chat does not exist yet, use 'Create Chat'";
}

mysqli_close($db);
?>