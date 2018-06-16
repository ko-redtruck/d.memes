function request(fn,data,resultFn) {
    console.log("calling: " + fn+" with "+JSON.stringify(data));
    $.post(
        "/fn/post/"+fn,
        data,
        function(response) {
            console.log("response: " + response);
            resultFn(response);
        }
    ).error(function(response) {
        console.log("response failed: " + response.responseText);
    })
    ;
};
