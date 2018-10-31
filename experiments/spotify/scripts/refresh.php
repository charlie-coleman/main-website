<?php
require '../vendor/autoload.php';
require './_connect.php';
require './_spotify_auth.php';

$session
$id = $_GET["usr"];

$db = new mysqli($db_host, $db_user, $db_password, $db_name);
if($db->connect_errno) {
	echo "Failed to connect to MySQL: (" . $db->connect_errno . ") " . $db->connect_error;
}

$query="SELECT * FROM tokens WHERE userID='" . $id . "' ORDER BY id DESC LIMIT 1";

if($db->real_query($query)) {
	$res = $db->use_result();
	$row = $res->fetch_assoc();
	$accessToken = $row["access"];
	$refreshToken = $row["refresh"];
    $id = $row["userID"];
}
else {
	echo "An error occurred";
	echo $db->errno;
}

$session->refreshAccesToken($refreshToken);
$accessToken = $session->getAccessToken();

$query = "UPDATE tokens SET access='" . $accessToken . "' WHERE userID='" . $id ."'";

$db->real_query($query);

$db->close();

?>