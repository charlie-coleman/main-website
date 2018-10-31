<?php
require '../vendor/autoload.php';
require '../scripts/_connect.php';
require '../scripts/_spotify_auth.php';

$db = new mysqli($db_host, $db_user, $db_password, $db_name);

if($db->connect_errno) {
	echo "Failed to connect to MySQL : (" . $db->connect_errno . ") " . $db->connect_error;
}

$session = new SpotifyWebAPI\Session(
	$client_id,
	$client_secret,
	$client_callback
);

$id = uniqid('', true);
$session->requestAccessToken($_GET["code"]);

$accessToken = $session->getAccessToken();
$refreshToken = $session->getRefreshToken();

$query = "INSERT INTO tokens (access, refresh, userID) VALUES ('". $accessToken. "', '" . $refreshToken . "' , '" . $id . "')";

if ($db->real_query($query)) {
	echo "Wrote message to db";
}
else {
	echo "An error ocurred";
	echo $db->errno;
}
$db->close();

header('Location: https://charlie-coleman.com/experiments/spotify/?usr='.$id);
die();
?>
