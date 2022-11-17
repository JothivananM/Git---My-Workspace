function userlist()
{
    $.ajax({
        type: "GET",
        url: "https://a4lr52mi53.execute-api.us-east-1.amazonaws.com/mock/",
        dataType: "json",
        success: function(successdata) {
           generateTable(successdata.body.MonthlyReport,"example1");
        },
        error: function (error) {
            alert('error; '+(error));
        }
    });
}


