$(()=>{

$("#playername").click(()=>{
  let username=$(":input").val();
$("#playername").attr("href","game.html?player="+username);
})
}
)
