<?php
    $dbName = "KITrental";
    $colName = $_POST['colName'];
    require("db-config.php");

    // Delete ONE record, HARD CODED on id field
    $deleteResult = $collection->updateOne(
        ['_id' => new MongoDB\BSON\ObjectID($_POST['userId'])],
        ['$set' => $_POST['toEditData']]
    );
    
    echo 1;
    exit;