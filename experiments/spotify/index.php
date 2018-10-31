<html>
	<head>
		<title>Spotify API Test</title>
        <link rel="stylesheet" type="text/css" href="/resources/css/palette.css">
        <link rel="stylesheet" type="text/css" href="/resources/fonts/opensans.css">
		<link rel="stylesheet" href="./style/style.css">
        <script src="/resources/js/jquery.js"></script>
        <script src="/resources/js/tracking.js"></script>
		<?php
            $usr = (isset($_GET["usr"])) ? trim($_GET["usr"]) : '';
            if($usr == '') {
                include "./scripts/auth.php";
            }
        ?>
		<script src="./scripts/main.js"></script>
	</head>
	<body>
        <div id="container">
            <img id="album-art" height="640" width="640">
        </div>
        <div id="container">
            <div id="spotify-info">
                <button id="previous" class="controls" onclick="javascript:previousSong();"><<</button>
                <div id="song-info"><b id="song-name"></b> by <b id="artist-name"></b></div>
                <button id="next" class="controls" onclick="javascript:nextSong();">>></button>
            </div>
        </div>
    </body>
</html>
