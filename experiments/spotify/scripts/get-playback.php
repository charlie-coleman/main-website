require 'vendor/autoload.php'

$session = new SpotifyWebAPI\Session(
	'a7e836a285be4037b36b30d3b032c5cd',
	'f601bfd71e074fa986ab92d6410d81fd',
	'https://charlie-coleman.com/experiments/spotify/callback'
);

$api = new SpotifyWebAPI\SpotifyWebAPI();

if (isset($_GET['code'])) {
	$session->requestAccessToken($_GET['code']);
	$api->setAccessToken($session-getAccessToken());

	print_r($api->me());
} else {
	$options = [
		'scope' => [
			'user-read-email',
		],
	];

	header('Location: ' . $session->getAuthorizeUrl($options));
	die();
}

$currPlay = $api->getMyCurrentTrack();

echo $currPlay
