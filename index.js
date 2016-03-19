$(document).ready(function() {
    $("#mode1").on("click", function() {
        $('#modal1').openModal();
    });
});

function postQuestion() {
    var headline = $("#headline").val();
    var content = $("#newsContent").val();
    var url = $("#newsURL").val();
    $.ajax({
        url: "http://localhost:3000/allnews",
        type: "POST",
        data: JSON.stringify({ "headLine": headline.toString(), "content": content.toString(), "url": url.toString(), "votes": 0}),
        contentType: "application/json",
        success: function(response) {
            console.log("Successful Insert");
            
        },
        error: function(error) {
            console.log(errer);
        }
    });
}
