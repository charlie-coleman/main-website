<?php
require("./_connect.php");

$db = new mysqli($db_host, $db_user, $db_password, $db_name);
if($df->connect_errno) {
    echo "Failed to connect to MySQL: (" . $db->connect_errno . ") " . $db_connect_error;
}

$username=substr($_GET["username"], 0, 32);
$text=substr($_GET["text"], 0, 140);
$chat=$_GET["chatName"];

$nameEscaped = htmlentities(mysqli_real_escape_string($db,$username));
$textEscaped = htmlentities(mysqli_real_escape_string($db,$text));
$textEscapedNew = filter_var($textEscaped, FILTER_SANITIZE_STRING);
$textEscaped = $textEscapedNew;

$query="INSERT INTO $chat (username, text, time) VALUES ('$username', '$text', DEFAULT);";

if($db->real_query($query)) {
    echo "Wrote message to db";
}
else {
    echo "An error occurred";
    echo $db->errno;
}

$db->close();

?>