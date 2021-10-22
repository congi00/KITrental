<?php
   // connect to mongodb
   $m = new MongoDB\Driver\Manager("mongodb://localhost:27017");
	
   echo "Connection to database successfully";
   // select a database
   $db = $m->admin;
	
   echo "Database admin selected";
?>