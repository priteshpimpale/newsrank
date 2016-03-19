// $(document).ready(function(){
//     $("#mode3").on("click", function() {

//         $('#modal3').openModal();
//     });
    
// });

function callmode(){
    $("#errorAlert").addClass("hide");
    $("#userName").val("");
    $("#password").val("");
    $('#modal3').openModal();
}
function authenticateUser(){
   var userName = $("#userName").val();
   $("#errorAlert").addClass("hide");
   $.ajax({
      url: "http://localhost:3000/users/?username="+userName, 
      type: "GET",
      contentType: "application/json",
      data: JSON.stringify({"username": userName.toString()}),
      success:function(response){
     
         console.log(response);
         console.log(response.length);
          if(response.length != 0){
              $("#errorAlert").toggleClass("hide");
          }
          else{
              registerUser();
          }
      },
      error: function(error){
          console.log("error "+error);
      }
   });  
}

function registerUser(){
    var userName = $("#userName").val();
    var password = $("#password").val();
    
     $.ajax({
        url: "http://localhost:3000/users",
        type: "POST",
        data: JSON.stringify({ "username": userName.toString(), "password": password.toString(), "up":0, "down":0 }),
        contentType: "application/json",
        success: function(response) {
            $('#modal3').closeModal();
            console.log("Successful Insert");
        },
        error: function(error) {
            console.log(errer);
        }
    });
}