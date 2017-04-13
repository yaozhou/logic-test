var $ = require('./jquery')

var store = {
    cover : {        
        need_pay : null,
        title : null,
        cover_text : null,
        test_time : null,
    },

    user : {

    },
} ;

var post_request_ary = [] ;

function process_request(ra) {
    if (post_request_ary.length > 0) {
        
        var request = post_request_ary[0] ;

        //console.log("post " + request.url) ;
        $.ajax({
            url : request.url,
            type : "POST",
            data : JSON.stringify(request.post_data),
            contentType : "application/json; charset=UTF-8", 
            dataType:"json",
            success : function(data) {
                //console.log("post result " + request.url) ;
                request.callback(data) ;
                post_request_ary = post_request_ary.slice(1) ;
                process_request() ;
            },
            error : function(xhr, status, error) {  
                request.callback(null, error) ;
                post_request_ary = post_request_ary.slice(1) ;
                process_request() ;
            },
        }) ;
    }
}

function query_async(url, post_data, callback) {
        
//      console.log("queue query : " + url) ;
        post_request_ary.push({url: url, post_data: post_data, callback: callback}) ;

        if (post_request_ary.length == 1) {
            process_request() ;            
        }       
    }

function query(url, param) {
    // return new Promise(function(resolve, reject) {
    //     $.post(url, param, function(data) {
    //         if (typeof data == 'string')
    //             data = JSON.parse(data) ;
    //         resolve(data) ;
    //     })
    // })

    return new Promise(function(resolve, reject) {
        query_async(url, param, function(data, err) {
            err ? reject(err) : resolve(data) ;
        })
    })
}

// 为啥这样写在android上正常，ios里根本就像没执行过一样?
function fetch_query(url, param) {
    var data = new FormData();
    data.append( "json", JSON.stringify( param ) );

    var option = {
        headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
        method : 'POST', 
        credentials : 'include', 
        body : JSON.stringify(param),
    } ;
    return fetch(url, option).then((res) => res.json()) ;
}

export { store, query } ;