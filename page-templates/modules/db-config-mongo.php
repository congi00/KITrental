<?php
   // connect to mongodb
   $m = new MongoDB\Driver\Manager("mongodb://localhost:27017");
	
   echo "Connection to database successfully";
   // select a database
   $db = $m->admin;
	
   $client = new MongoDB\Driver\Manager('mongodb+srv://admin:admin@cluster0.w0e0y.mongodb.net/test?retryWrites=true&w=majority');

   echo "Database admin selected";
?>