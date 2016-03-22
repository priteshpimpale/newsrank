// var userInfo ={
//       "id": 1,
//       "username": "user001",
//       "password": "password001",
//       "votes": {
//         "up": [1,2],
//         "down": [3] }
//     };
var userInfo = null;

function postQuestion() {
    
    
    
    var headline = $("#headline").val();
    var content = $("#newsContent").val();
    var url = $("#newsURL").val();
    
    if(headline !== "" && content !== ""){
        $.ajax({
            url: "/allnews",
            type: "POST",
            data: JSON.stringify({ "headLine": headline.toString(), "content": content.toString(), "url": url.toString(), "votes": 0 , "date" : new Date() }),
            contentType: "application/json",
            success: function(response) {
                console.log("Successful Insert");
                response.up = "black-text";
                response.down = "black-text";
                var card = createCard(response);
                $("#topnews")[0].innerHTML += card;
                $("modal1").closeModal();
                
            },
            error: function(error) {
                console.error("Error : " + error.status);
            }
        });
    }else{
        $("#postError").toggleClass("hide",false);
    }
}

function loadNews(section) {
    var newsDiv,sort,url,querystring="";
    if(section === "top" ){
        newsDiv = "#topnews";
        url = "/allnews/?_sort=votes&_order=DESC";
    }else if(section === "latest"){
        newsDiv = "#latestnews";
        url = "/allnews/?_sort=date&_order=DESC";
    }else if(section === "liked"){
        newsDiv = "#likednews";
        $.each(userInfo.votes.up,function(i,item){
            querystring += "id="+item+"&";
        });
        url = "/allnews/?"+(querystring === "" ? "id=black":querystring);
    }else if(section === "disliked"){
        newsDiv = "#dislikednews";
        $.each(userInfo.votes.down,function(i,item){
            querystring += "id="+item+"&";
        });
        url = "/allnews/?" + (querystring === "" ? "id=black":querystring);
    }
    
    $.ajax({
        type: "GET",
        url: url,
        datatype: "json",
        success: function(response) {
            console.log("Get all news successfull");
            if(section === "latest"){
                response.sort(function(a,b){
                    //console.log(new Date(a.date));
                    return new Date(b.date) - new Date(a.date);
                });
            }
            if(response.length > 0){
                $.each(response, function(i, item) {
                    console.log(new Date(item.date));
                    if (userInfo !== null) {
                        item.up = (userInfo.votes.up.indexOf(item.id) != -1) ? "blue-text" : "black-text";
                        item.down = (userInfo.votes.down.indexOf(item.id) != -1) ? "red-text" : "black-text";
                    }
                    else {
                        item.up = "black-text";
                        item.down = "black-text";
                    }
                    var card = createCard(item);
                    $(newsDiv)[0].innerHTML += card;
                });
            } else{
                var cardnew = "<div class=\"row\"><div class=\"col s12 m12 l12 \"><div class=\"card-panel\">"+
                    "<span class=\"black-text\"> Nothing to show </span></div></div></div>";
                $(newsDiv)[0].innerHTML += cardnew;
            }
        },
        error: function(xhr) {
            console.error("Error fetching news: " + xhr.status + "\n" + xhr.responseText);
        }
    });
}


var createCard = function(item){
    return "<div class=\"col s12 m6 l4\">" +
                "<div class=\"card hoverable\" data-activates=\"read-news-slide\">" +
            "<div class=\"card-content\">" +
            "<span class=\"card-title truncate\">" + item.headLine + "</span>" +
            "<p>" + item.content + "</p>" +
            "<a target=\"_blank\" class=\"truncate\" href=\"" + item.url + "\">" + item.url + "</a>" +
            "</div>" +
            "<div data-id=\"" + item.id + "\" class=\"card-action right-align\">" +
            /*"<a><span>3</span><span> Comments</span></a>" +*/
            // "<a href=\""+ item.url +"\">"+ item.url +"</a>"+
            "<a class=\"waves-effect waves-teal btn-flat btn-floating  white thumbdown\"><i class=\"material-icons " + item.down + "\">thumb_down</i></a>" +
            "<span class=\"votes\">" + item.votes + "</span>" +
            "<a class=\"waves-effect waves-teal btn-flat btn-floating white thumbup\"><i class=\"material-icons " + item.up + "\">thumb_up</i></a>" +
            "</div></div></div>";
}

var thumbupClick = function() {
    console.log($(this)[0].className + " clicked");
    var newsId = Number($(this)[0].parentElement.dataset.id);
    var newsVotes = Number($(this).parent().find("span.votes")[0].innerHTML);

    var thumbup = ($(this).find("i.material-icons")[0].className.split(' ').indexOf("blue-text") != -1);
    var thumbdown = ($(this).parent().find("a.thumbdown i.material-icons")[0].className.split(' ').indexOf("red-text") != -1);

    if (userInfo != null) {
        $(this).find("i.material-icons").toggleClass("blue-text");
        $(this).find("i.material-icons").toggleClass("black-text");
        // already liked ==> remove like & remove 1 vote
        if (thumbup && !thumbdown) {
            userInfo.votes.up.splice(userInfo.votes.up.indexOf(newsId), 1);
            newsVotes -= 1;
        }
        // not liked and not disliked  ==>  add like & add 1 vote
        else if (!thumbup && !thumbdown) {
            userInfo.votes.up.push(newsId);
            newsVotes += 1;
        }
        // not liked but disliked ==>  add like, remove dislike & add 2 votes
        else if (thumbdown && !thumbup) {
            userInfo.votes.up.push(newsId);
            userInfo.votes.down.splice(userInfo.votes.down.indexOf(newsId), 1);
            newsVotes += 2;
            $(this).parent().find("a.thumbdown i.material-icons").addClass("black-text");
            $(this).parent().find("a.thumbdown i.material-icons").removeClass("red-text");
        }
        $(this).parent().find("span.votes")[0].innerHTML = newsVotes;


        updateNewsVotes(newsId, newsVotes);
        updateUserVotes();
    } else {
        Materialize.toast('Please Sign in to Vote!', 2000)
    }
};

var thumbdownClick = function() {
    console.log($(this)[0].className + " clicked");
    var newsId = Number($(this)[0].parentElement.dataset.id);
    var newsVotes = Number($(this).parent().find("span.votes")[0].innerHTML);

    var thumbup = ($(this).parent().find("a.thumbup").find("i.material-icons")[0].className.split(' ').indexOf("blue-text") != -1);
    var thumbdown = ($(this).find("i.material-icons")[0].className.split(' ').indexOf("red-text") != -1);

    if (userInfo != null) {
        $(this).find("i.material-icons").toggleClass("red-text");
        $(this).find("i.material-icons").toggleClass("black-text");
        // already disliked ==> remove dislike & add 1 vote
        if (!thumbup && thumbdown) {
            userInfo.votes.down.splice(userInfo.votes.down.indexOf(newsId), 1);
            newsVotes += 1;
        }
        // not disliked and not liked ==> add like & add 1 vote
        else if (!thumbup && !thumbdown) {
            userInfo.votes.down.push(newsId);
            newsVotes -= 1;
        }
        // not disliked but liked  ==>  add dislike, remove like & subtract 2 votes
        else if (!thumbdown && thumbup) {
            userInfo.votes.down.push(newsId);
            userInfo.votes.up.splice(userInfo.votes.up.indexOf(newsId), 1);
            newsVotes -= 2;
            $(this).parent().find("a.thumbup i.material-icons").addClass("black-text");
            $(this).parent().find("a.thumbup i.material-icons").removeClass("blue-text");

        }
        $(this).parent().find("span.votes")[0].innerHTML = newsVotes;
        updateNewsVotes(newsId, newsVotes);
        updateUserVotes();
    } else {
        Materialize.toast('Please Sign in to Vote!', 2000);
    }
};


function updateNewsVotes(newsId, votes) {
    $.ajax({
        type: "PATCH",
        url: "/allnews/" + newsId,
        data: JSON.stringify({ "votes": votes }),
        contentType: "application/json",
        datatype: "json",
        success: function(response) {
            console.log("update News Votes successfull");
        },
        error: function(xhr) {
            console.error("Patch News Votes Error: " + xhr.status + "\n" + xhr.responseText);
        }
    });
}

function updateUserVotes() {
    $.ajax({
        type: "PATCH",
        url: "/users/" + userInfo.id,
        data: JSON.stringify({ "votes": userInfo.votes }),
        contentType: "application/json",
        datatype: "json",
        success: function(response) {
            console.log("update User Info successfull");
        },
        error: function(xhr) {
            console.error("Patch Users Error: " + xhr.status + "\n" + xhr.responseText);
        }
    });
}

function authenticateUser() {
    var userName = $("#siuserName")[0].value;
    var password = $("#sipassword")[0].value;
    $("#modalsigninerror").addClass("hide");
    $.ajax({
        url: "/users/?username=" + userName + "&password=" + password,
        type: "GET",
        contentType: "application/json",
        //data: JSON.stringify({"username": userName.toString()}),
        success: function(response) {
            console.log(response);
            console.log(response.length);
            
            if (response.length === 0) {
                $("#modalsigninerror").toggleClass("hide");
            }
            else if (response.length === 1) {
                userInfo = response[0];
                loadNews("liked");
                loadNews("disliked");
                $("#signinSuccess").toggleClass("hide");
                $("#usernameTitleBar")[0].innerHTML = userInfo.username + "<i class=\"material-icons right\">arrow_drop_down</i>";
                $("#musernameTitleBar")[0].innerHTML = userInfo.username + "<i class=\"material-icons right\">arrow_drop_down</i>";
                $("#usernameTitleBar,#musernameTitleBar").toggleClass("hide",false);
                $("#mode1,#mmode1").toggleClass("hide",false); 
                $("#mode2,#mmode2,#mode3,#mmode3").toggleClass("hide",true);
                $("#tabliked,#tabdisliked").toggleClass("hide",false);
                $("#tabs").find("li.tabs a.active").toggleClass("active",false);
                $("#tabtop").find("a").toggleClass("active",true);
                //$("").toggleClass("hide",false);
                setTimeout(function() {
                    $('#modalsignin').closeModal();
                    $("#signinSuccess").toggleClass("hide");
                }, 2000);

                updateupdownvotesonscreen(true);
            }
        },
        error: function(xhr) {
            console.error("Authenticate User Error: " + xhr.status + "\n" + xhr.responseText);
        }
    });
}

function updateupdownvotesonscreen(signin) {
    // update up and down vote thumb color on sign in
    // to be implemented
    if(signin){
        var cards = $("#topnews").find("div.col");
        $.each(cards, function(i, card) {
            var newsId = Number($(card).find("div.card div.card-action")[0].dataset.id);
            var upVote = (userInfo.votes.up.indexOf(newsId) !== -1);
            var downVote = (userInfo.votes.down.indexOf(newsId) !== -1);
            if (upVote) {
                $(card).find("div.card div.card-action a.thumbup i.material-icons").toggleClass("black-text");
                $(card).find("div.card div.card-action a.thumbup i.material-icons").toggleClass("blue-text");
            }
            if (downVote) {
                $(card).find("div.card div.card-action a.thumbdown i.material-icons").toggleClass("black-text");
                $(card).find("div.card div.card-action a.thumbdown i.material-icons").toggleClass("red-text");
            }
        });
    } else {
        var cards = $("#topnews").find("div.col");
        $.each(cards, function(i, card) {
                $(card).find("div.card div.card-action a.thumbup i.material-icons").toggleClass("black-text",true);
                $(card).find("div.card div.card-action a.thumbup i.material-icons").toggleClass("blue-text",false);
                $(card).find("div.card div.card-action a.thumbdown i.material-icons").toggleClass("black-text",true);
                $(card).find("div.card div.card-action a.thumbdown i.material-icons").toggleClass("red-text",false);
        });
    }
}


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
        url: "/users/?username=" + userName,
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
        url: "/users",
        type: "POST",
        data: JSON.stringify({ "username": userName.toString(), "password": password.toString(), "votes": votes }),
        contentType: "application/json",
        success: function(response) {
            $("#regSuccess").toggleClass("hide");
            userInfo = response;
            $("#usernameTitleBar,#musernameTitleBar")[0].innerHTML = userInfo.username + + "<i class=\"material-icons right\">arrow_drop_down</i>"; 
            $("#usernameTitleBar,#musernameTitleBar").toggleClass("hide",false);
            $("#mode1,#mmode1").toggleClass("hide",false);
            $("#mode2,#mmode2,#mode3,#mmode3").toggleClass("hide",true);
            updateupdownvotesonscreen(true);
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

var searchNews = function(){
    var query = $("#search")[0].value;
    var cards = $("#topnews").find("div.col");
    cards = $.merge(cards,$("#latestnews").find("div.col"));
    $.each(cards, function(i, card) {
        var content = $(card).find("div.card div.card-content p")[0].innerHTML.toLowerCase();
        var header  = $(card).find("div.card div.card-content span.card-title")[0].innerHTML.toLowerCase();
        if (content.indexOf(query) === -1 && header.indexOf(query) === -1){
            $(this).toggleClass("hide",true);
        }else{
            $(this).toggleClass("hide",false);
        }
    });
};


$(document).ready(function() {
    // the "href" attribute of .modal-trigger must specify the modal ID that wants to be triggered
    $("#mod").on("click", function() {
        $("#demomodal").openModal();
    });

    $("#mode1,#mmode1").on("click", function() {
        $('#modal1').openModal();
        $("#postError").toggleClass("hide",true);
    });
    
    $(".button-collapse").sideNav();
    
    $(".cardl").sideNav({
      menuWidth: 500, // Default is 240
      edge: 'right', // Choose the horizontal origin
      closeOnClick: true // Closes side-nav on <a> clicks, useful for Angular/Meteor
    });

    $("#mode2,#mmode2").on("click", function() {
        $("#siuserName")[0].value = "";
        $("#sipassword")[0].value = "";
        $("#siuserName").blur();
        $("#sipassword").blur();
        $("#modalsigninerror").toggleClass("hide", true);
        $("#signinSuccess").toggleClass("hide", true);
        $('#modalsignin').openModal();
    });

    $("#topnews,#latestnews,#likednews,#dislikednews").on("click", "div.col div.card div.card-action a.thumbup", thumbupClick);
    $("#topnews,#latestnews,#likednews,#dislikednews").on("click", "div.col div.card div.card-action a.thumbdown", thumbdownClick);

    $("#signout,#msignout").on("click", function() {
        $('.button-collapse').sideNav('hide');
        userInfo = null;
        $("#usernameTitleBar,#musernameTitleBar")[0].innerHTML = "";
        $("#usernameTitleBar,#musernameTitleBar").toggleClass("hide",true);
        $("#mode1,#mmode1").toggleClass("hide",true);
        $("#mode2,#mmode2,#mode3,#mmode3").toggleClass("hide",false);
        $("#tabliked,#tabdisliked").toggleClass("hide",true);
        updateupdownvotesonscreen(false);
        Materialize.toast('Successfully Signed out.', 2000);
    });
    
    $("#search").on("change",searchNews);
    loadNews("top");
    loadNews("latest");
});