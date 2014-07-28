<?php
/**
 * proxy.php
 * Acts as a server-side requestor for data on behalf of the client-side, in order to get around the "same-origin" problem
 * (NOTE: there could be a small security risk by doing a naiive REQUEST to pass the proxy URL without POST + SSL and more thorough validation. Only if an attacker knew the location of this script, would there be a chance they can use it as a proxy for attacks to other servers, or this server. For our purposes, it probably is negligible, but for more on how to solve potential issues, see: http://php.net/manual/en/function.fopen.php or: http://www.virtualforge.de/vmovie/xss_selling_platform_v1.0.php)
 */

$url = $_REQUEST['url']; //URL to grab (again, see NOTE on security above)
if (empty($url)) { $url = "http://saunby.net/index.html"; } //make sure we always get some data

header('Cache-Control: no-cache, must-revalidate'); //force fresh request
header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
header("Content-type: video/webm");

try {
// Get remote content/data (NOTE: your hosting provider may not allow fopen, if not you can request they allow for your VPS...if still not, we can use file_get_contents or CURL lib instead)
$handle = fopen($url, "r");

// some content/data was received, then read & return
if ($handle) {
while (!feof($handle)) {
$buffer = fgets($handle, 4096);
echo $buffer;
}
fclose($handle);
}
}
catch (Exception $e) {
print file_get_contents($url);
}
?>
