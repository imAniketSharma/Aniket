<?php

$Name = $_POST['Name'];
$Email = $_POST['Email'];
$Subject = $_POST['Subject'];
$Message = $_POST['Message'];


  // $server = "localhost";
  // $username = "root";
  // $password = "";

  $conn = new mysqli('localhost','root', '', 'portfolio_contact_us');

  if($conn->connect_error){
    die("connection to this database failed due to " .$conn->connect_error);
  }else{
    $stmt = $conn->prepare("Inserting(Name, Email, Subject, Message) values(?, ?, ?, ?)");
    $stmt->bind_param("ssss", $Name, $Email, $Subject, $Message);
    $stmt->execute();
    echo "Your message is Sent, Thank You!";
    $stmt->close();
    $conn->close();
  }
  // echo"Success connecting to the db";


  // $sql = "INSERT INTO `contact_us` (`Name`, `Email`, `Subject`, `Message`, `Date_Time`) VALUES ('$Name', '$Email', '$Subject', '$Message', current_timestamp());";

  // echo $sql;
  
  // // Replace contact@example.com with your real receiving email address
  // $receiving_email_address = 'aniketsharma552@gmail.com';

  // if( file_exists($php_email_form = '../vendor/php-email-form/php-email-form.php' )) {
  //   include( $php_email_form );
  // } else {
  //   die( 'Unable to load the "PHP Email Form" Library!');
  // }

  // $contact = new PHP_Email_Form;
  // $contact->ajax = true;
  
  // $contact->to = $receiving_email_address;
  // $contact->from_name = $_POST['name'];
  // $contact->from_email = $_POST['email'];
  // $contact->subject = $_POST['subject'];

  // // Uncomment below code if you want to use SMTP to send emails. You need to enter your correct SMTP credentials
  
  // $contact->smtp = array(
  //   'host' => 'example.com',
  //   'username' => 'example',
  //   'password' => 'pass',
  //   'port' => '587'
  // );
  

  // $contact->add_message( $_POST['name'], 'From');
  // $contact->add_message( $_POST['email'], 'Email');
  // $contact->add_message( $_POST['message'], 'Message', 10);

  // echo $contact->send();
?>
