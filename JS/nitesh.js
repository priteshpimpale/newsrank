// $(document).ready(function(){
//     $("#mode3").on("click", function() {
//         $('#modal3').openModal();
//     });
// });

function callmode() {
    $("#errorAlert").addClass("hide");
    $("#userName").val("");
    $("#password").val("");
    $('#modal3').openModal();
}
function checkUserName() {
    var userName = $("#userName").val();
    $("#errorAlert").addClass("hide");
    $.ajax({
        url: "http://localhost:3000/users/?username=" + userName,
        type: "GET",
        contentType: "application/json",
        data: JSON.stringify({ "username": userName.toString() }),
        success: function(response) {

            console.log(response);
            console.log(response.length);
            if (response.length != 0) {
                $("#errorAlert").toggleClass("hide");
            }
            else {
                registerUser();
            }
        },
        error: function(error) {
            console.log("error " + error);
        }
    });
}

function registerUser() {
    var userName = $("#userName").val();
    var password = $("#password").val();
    var votes = { "up": [], "down": [] };
    $.ajax({
        url: "http://localhost:3000/users",
        type: "POST",
        data: JSON.stringify({ "username": userName.toString(), "password": password.toString(), "votes": votes }),
        contentType: "application/json",
        success: function(response) {
            $("#regSuccess").toggleClass("hide");
            userInfo = response;
            setTimeout(function() {
                $('#modal3').closeModal();
                $("#regSuccess").toggleClass("hide");
            }, 2000);
            console.log("Successful Registration");
        },
        error: function(xhr) {
            console.error("Registration Error: " + xhr.status + "\n" + xhr.responseText);
        }
    });
}