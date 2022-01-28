<?php
   // Composer mongodb require
   require_once '../../vendor/autoload.php';

   // connect to mongodb (local for now)
   $mc= new MongoDB\Client("mongodb://localhost:27017");

   // select a database
   $db = $mc->$dbName;

   // select a collection
   $collection = $db->$colName;
?>
