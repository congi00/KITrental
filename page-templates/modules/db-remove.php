<?php
    require("db-config.php");

    /* Checking if ID exists
    $id = 0;
    if(isset($_POST['id'])){
       $id = mysqli_real_escape_string($con,$_POST['id']);
    }
    */

//    if($id > 0){
    
      /* Check record exists
      $checkRecord = mysqli_query($con,"SELECT * FROM posts WHERE id=".$id);
      $totalrows = mysqli_num_rows($checkRecord);
        */

      //if($totalrows > 0){
        // Delete record
        $user = mysqli_real_escape_string($con,$_POST['username']);
        $query = "DELETE FROM clients WHERE username='".$user."'";
        mysqli_query($con,$query);
        echo 1;
        exit;
      /*}else{
        echo 0;
        exit;
      }
    }*/
    
    echo 0;
    exit;