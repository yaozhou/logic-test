

var URL_PREFIX = "" ;

var start_test_free = fetch_post(URL_PREFIX + '/api/test_begin', {}, 'PUZZLE_GET') ;
var get_week_pre_ranking = fetch_post(URL_PREFIX + '/api/score_list', {type : "week_pre"}, "RANKING_WEEK_PRE") ;
var get_week_ranking = fetch_post(URL_PREFIX + '/api/score_list', {type : "week"}, "RANKING_WEEK") ;
var get_year_ranking = fetch_post(URL_PREFIX + '/api/score_list', {type : "year"}, "RANKING_YEAR") ;
var get_conf = fetch_post(URL_PREFIX + '/api/conf_get', {"b":"b"}, 'CONF_GET') ;
var cheat_login = fetch_post(URL_PREFIX + '/api/login_by_cheat', {}, 'CHEAT_LOGIN') ;
var get_score = (dispatch) => (test_id) => { 
        fetch_post(URL_PREFIX + '/api/score_share', {test_id : test_id}, 'SCORE_SHARE')(dispatch) ;
    }

var report_answer = (dispatch) => (test_id, answer, left_time) => {
    fetch_post(URL_PREFIX + '/api/test_finish', {test_id : test_id, answers : answer, test_time : left_time}, "PUSH_ANSWER")(dispatch) ;
}

var dynamic_action = {
        get_conf                : get_conf,
        start_test              : start_test_free,
        report_answer    : report_answer,
        test_from_share        : () => History.replace('/cover'),
        cheat_login         : cheat_login,
        get_score : get_score,
        get_week_pre_ranking : get_week_pre_ranking,
        get_week_ranking : get_week_ranking,
        get_year_ranking : get_year_ranking,
}

function get_dynamic_action() {
    return dynamic_action ;
}



function fetch_post(url, param, id) {
    return  function(dispatch) {
        dispatch( { type: id + '_PENDING'} ) ;

        var data = new FormData();
        data.append( "json", JSON.stringify( param ) );

        var option = {
            headers: {
                   'Content-Type': 'application/json',
            },
            method : 'POST', 
            credentials : 'include', 
            body : JSON.stringify(param),
        } ;        

        return fetch(url, option).then((res) => res.json()).then(
                    (result) => dispatch({ type: id + '_SUCCESS', result }),
                    (error) => dispatch({ type: id + '_FAILURE', error })
        );
    };
}





