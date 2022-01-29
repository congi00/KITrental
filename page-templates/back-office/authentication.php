<?php
  session_start();

  if(!isset($_SESSION['loggedIn'])){
    // Connection to the DB
    $dbName = "KITrental";
    $colName = "employees";
    include("../modules/db-config.php");

    // Retrieve employee
    $emplId = strtolower($_POST['emplId']);
    $emplPw = sha1($_POST['emplPw']);

    $query = ['username' => $emplId];
    $empl = $collection->findOne($query);

    if($empl)
      if($empl['password'] != $emplPw)
        echo false;
      else{
        $_SESSION['loggedIn']=$empl['_id'];
        echo $_SESSION['loggedIn'];
      }
    else
      echo false;

  }else{
    echo $_SESSION['loggedIn'];
  }


?>
