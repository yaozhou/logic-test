


var store = {
    cover : {        
        need_pay : null,
        title : null,
        cover_text : null,
        test_time : null,
    },

    test :  {
        loading : "not_start",
        test_id : null,
        puzzles : [],
    },

    score : {
        id : null,
        score : null,
        score_100 : null,
        test_time : null,
        short_comment : null,
        comment : null,
    },

    ranking : {
        week_pre : [],
        week : [],
        year : [],
    }

   
} ;

function query(url, param) {
    var data = new FormData();
    data.append( "json", JSON.stringify( param ) );

    var option = {
        headers: {'Content-Type': 'application/json'},
        method : 'POST', 
        credentials : 'include', 
        body : JSON.stringify(param),
    } ;
    return fetch(url, option).then((res) => res.json()) ;
}

export { store, query } ;