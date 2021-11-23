<?php
    $dbName = "KITrental";
    $colName = $_GET['colName'];
    require("db-config.php");

    $query = [$_GET['fieldName'] => new MongoDB\BSON\Regex($_GET['searchTerm'], 'i')];
    if (str_contains($_GET['fieldName'], 'id')) {
        $clientId = new MongoDB\BSON\ObjectID($_GET['searchTerm']);
        $query = [$_GET['fieldName'] => $clientId];
    }

    // Search through the database for ONE or MORE depending on the singleResult parameter
    if ($_GET['singleResult'] === true) {
        // Single Result
        echo json_encode($collection->findOne($query));
    } else {
        // Several Results, returns a mongo Cursor
        $cursor = $collection->find($query);
        $returnArr = [];
        foreach($cursor as $document) {
            array_push($returnArr, $document);
        }
        echo json_encode($returnArr);
    }
    exit;