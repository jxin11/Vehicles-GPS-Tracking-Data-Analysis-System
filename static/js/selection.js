function selectID(arr) {

  var x = document.getElementById("search_id").value;
  
  if (x === "0"){
    alert("Please select an ID.");
    return false;
  }
  else{

    $.ajax({
      type: "POST",
      url: "/customer/getID",
      contentType: "application/json",
      data: JSON.stringify(x),
      dataType: "json",
      success: function(response) {
        console.log(response);
      },
      error: function(err) {
        console.log(err);
      }
    });

    // $.ajax({
    //   url: '/customer/home',
    //   type: "GET",
    //   data: {custID: x},
    //   success: function(){
    //     alert(x)
    //   }
    // });

    window.location.href = '/customer/home';
  }

  // const datafilter = arr.filter(d => d['date'] === x);  
  // document.getElementById("speedGraph").innerHTML = speedGraph(datafilter);
  // speedGraph(datafilter);
}