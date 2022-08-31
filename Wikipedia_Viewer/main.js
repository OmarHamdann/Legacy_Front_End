
var search;
var api;

$("document").ready(function(){
 
  $("#search").click(function() {

  search = $("#searchWord").val();
  
  api = "https://en.wikipedia.org/w/api.php?action=opensearch&search="+ search +"&format=json&callback=?";

  $("#searchWord").val(""); 
    $("#response").html("");
   $.ajax({
     type: "GET",
     url:api,
     async:false,
     dataType:"json",
     success: function(result){
       $("#title").html("Results for " + result[0]);
       for (i=0; result[1].length > i; i++) {
         $("#response").append("<li class=" + '"list" >' + "<a href='"+result[3][i]+"' target='_blank'> <p>" + result[1][i] +"</p></a>"+result[2][i]+"</li>")
       };
       
     },
     error: function(error){
       $("#response").html("Error");
     },
   })//End of Ajax
});
       $("#searchWord").keypress(function(e){
  if(e.which==13){
    $("#search").click();
  }
});
  });//end of doc ready
