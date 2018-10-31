
<?php
require './vendor/autoload.php';
require './scripts/_spotify_auth.php';

$session = new SpotifyWebAPI\Session(
	$client_id,
	$client_secret,
	$client_callback
);

$options=[
	'scope'=>[
		'user-read-currently-playing',
		'user-read-playback-state',
		'streaming',
	],
];

$authURL =  $session->getAuthorizeUrl($options);
echo $authURL;

header('Location: ' . $authURL);
die();
?>
