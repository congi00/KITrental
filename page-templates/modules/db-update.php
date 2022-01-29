<?php
    $dbName = "KITrental";
    $colName = $_POST['colName'];
    require("db-config.php");

    // DATA FIELDS VALIDATION FOR QUERYING, WILL PROBABLY BECOME A FUNCTION LATER ON
    foreach ($_POST['toUpdateData'] as $field_key => $field_val) {
        if (str_contains($field_key, 'date')) {
            $_POST['toUpdateData'][$field_key] = new MongoDB\BSON\UTCDateTime(new DateTime($field_val));
        }
    }

    // Delete ONE record, HARD CODED on id field
    $updateResult = $collection->updateOne(
        ['_id' => new MongoDB\BSON\ObjectID($_POST['recordId'])],
        ['$set' => $_POST['toUpdateData']]
    );


    // Additional create query for the update operation (operations collection linked to the rental)
    if ($colName == "rental") {
        $colName = "operations";
        $collection = $db->$colName;
        $collection->insertOne(
            [
                "type" => "rent_update",
                "linkedTo_id" => new MongoDB\BSON\ObjectID($_POST['recordId']),
                "employee_id" => null,
                "notes" => null
            ]
        );
    }



    echo 1;
    exit;
