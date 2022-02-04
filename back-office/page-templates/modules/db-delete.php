<?php
    $dbName = "KITrental";
    $colName = $_POST['colName'];
    require("db-config.php");

    // Delete ONE record, HARD CODED on id field
    $deleteResult = $collection->deleteOne(['_id' => new MongoDB\BSON\ObjectID($_POST['userId'])]);
    
    echo 1;
    exit;