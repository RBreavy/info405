<?php

$conn = mysqli_connect("localhost", "info2", "Pi8", "info2");
if (!$conn) {
	print ("problem");
}
mysqli_set_charset($conn, "utf8");

?>