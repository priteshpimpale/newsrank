$(document).ready(function(){
    // the "href" attribute of .modal-trigger must specify the modal ID that wants to be triggered
    $("#mod").on("click",function(){
        $("#modal1").openModal();
    })
    
    loadNews();
    
    
  });
  
  function loadNews(){
      $.ajax({
          type:"GET",
          url:"http://localhost:3000/allnews",
          datatype:"json",
          success: function(response){
              $.each(response,function(i,item){
                  var card = "<div class=\"col s12 m4\">"+ 
                    "<div class=\"card hoverable\">" +
                      "<div class=\"card-content\">" +
                      "<span class=\"card-title truncate\">"+item.headLine+"</span>" +
                      "<p>"+ item. content +"</p>" +
                      "<p>"+ item.url +"</p>"+
                      "</div>" +
                      "<div class=\"card-action right-align\">" +
                      "<a><span>3</span><span> Comments</span></a>" +
                      "<a class=\"waves-effect waves-teal btn-flat\"><i class=\"material-icons\">thumb_down</i></a>" +
                      "<span>"+ item.votes +"</span>" +
                      "<a class=\"waves-effect waves-teal btn-flat\"><i class=\"material-icons\">thumb_up</i></a>" +
                      "</div>" +
                      "</div>"+ "</div>";
                    $("#topnews")[0].innerHTML += card;
                      
                 
              });
             
          },
          error: function(){
              
          } 
      });
  }