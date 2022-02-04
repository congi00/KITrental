<?php
    $dbName = "KITrental";
    $colName = $_POST['colName'];
    require("db-config.php");
    
    // DATA FIELDS VALIDATION FOR QUERYING, WILL PROBABLY BECOME A FUNCTION LATER ON 
    foreach ($_POST['toCreateData'] as $field_key => $field_val) {
        // Turns a date string in the BSON Object
        if (str_contains($field_key, 'date')) {  
            $_POST['toCreateData'][$field_key] = new MongoDB\BSON\UTCDateTime(new DateTime($field_val));
        }
        // Turns an ID string in the BSON Object
        if (str_contains($field_key, 'id')) {
            $documentId = $field_val;
            $parName = "id=";
            $index = strpos($field_val, $parName);
            if ($index !== false) {
                $index += strlen($parName);
                $documentId = substr($field_val, $index);
            }

            $_POST['toCreateData'][$field_key] = new MongoDB\BSON\ObjectID($documentId);
        }
    }

    // Link to the employee who created the operation
    if ($colName == "operations") {
        session_start();
        $_POST['toCreateData']["employee_id"] = $_SESSION["loggedIn"];
    }

    $insertOneResult = $collection->insertOne(
        $_POST['toCreateData']
    );

    // Additional create query for the create operation (operations collection linked to the rental)
    if ($colName == "rental") {
        session_start();
        $colName = "operations";
        $collection = $db->$colName;
        $collection->insertOne(
            [
                "type" => "rent_create",
                "linkedTo_id" => $insertOneResult->getInsertedId(),
                "employee_id" => $_SESSION["loggedIn"],
                "notes" => null
            ]
        );
    } 

    echo 1;
    exit;