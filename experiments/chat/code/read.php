<?php
require("./_connect.php");

$chat=$_GET["chat"];
$timezone=$_GET["time"];
$offset = (int)$timezone;
$tz = timezone_name_from_abbr('', $offset * 3600, 0);

$db = new mysqli($db_host, $db_user, $db_password, $db_name);

if($db->connect_error) {
    echo "Connection failed: " . $db->connect_error;
}

$query="SELECT * FROM $chat ORDER BY time ASC;";
$result=$db->query($query);

if($result->num_rows > -1) { 

    while ($row = $result->fetch_assoc()) {
        $username=$row["username"];
        $text=$row["text"];
        $textNew = filter_var($text, FILTER_SANITIZE_STRING);
        $text = $textNew;
        $time1=new DateTime("now");
        $time1->setTimestamp(strtotime($row["time"]));
        $time1->setTimezone(new DateTimeZone($tz));
        $time=$time1->format('H:i');

        $text = makeLinks($text);

        echo "<p><time>$time</time> | <username>$username</username>: <message>$text</message></p>";
    }

}
else {
    echo "An error occured";
    echo $db->errno;
}

function makeLinks($str) {
	$reg_exUrl = "/(http|https|ftp|ftps)\:\/\/[a-zA-Z0-9\-\.]+\.[a-zA-Z]{2,3}(\/\S*)?/";
	$urls = array();
	$urlsToReplace = array();
	if(preg_match_all($reg_exUrl, $str, $urls)) {
		$numOfMatches = count($urls[0]);
		$numOfUrlsToReplace = 0;
		for($i=0; $i<$numOfMatches; $i++) {
			$alreadyAdded = false;
			$numOfUrlsToReplace = count($urlsToReplace);
			for($j=0; $j<$numOfUrlsToReplace; $j++) {
				if($urlsToReplace[$j] == $urls[0][$i]) {
					$alreadyAdded = true;
				}
			}
			if(!$alreadyAdded) {
				array_push($urlsToReplace, $urls[0][$i]);
			}
		}
		$numOfUrlsToReplace = count($urlsToReplace);
		for($i=0; $i<$numOfUrlsToReplace; $i++) {
			$str = str_replace($urlsToReplace[$i], "<a href=\"".$urlsToReplace[$i]."\">".$urlsToReplace[$i]."</a> ", $str);
		}
		return $str;
	} else {
		return $str;
	}
}


mysqli_close($db);
?>