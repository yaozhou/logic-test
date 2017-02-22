import { combineReducers } from 'redux'
import action from './action'
import { get_dynamic_action } from './action'

import { useRouterHistory } from 'react-router';
import { createHashHistory } from 'history';
const History = useRouterHistory(createHashHistory)({queryKey: false}) ;



 var init_state = {
    cover : {
        loading : "not_start",
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



 function reducer(state, action) {
  if (action.type == "@@redux/INIT") return init_state ;

  var ret = Object.assign({}, state) ;

  switch (action.type) {

    case "CONF_GET_PENDING": 
            ret.cover.loading = 'pending' ;
            return ret ;        

    case "CONF_GET_SUCCESS": 
            ret.cover.loading = "finished" ;
            ret.cover.title = action.result.title ;
            ret.cover.cover_text = action.result.cover_text ;
            ret.cover.test_time = action.result.test_time ;
            get_dynamic_action().get_conf = null ;
            return ret ;

    case "PUZZLE_GET_PENDING":
            ret.test.loading = "pending" ;
            return ret ;            

    case "PUZZLE_GET_SUCCESS":
            ret.test.loading = "finished" ;
            ret.test.puzzles = action.result.puzzle ;
            ret.test.test_id   = action.result.test_id ;
            ret.test.puzzle_idx = 0 ;
            ret.test.left_time = ret.cover.test_time ;
            History.replace("/puzzle") ;
            return ret ;

    case "PUSH_ANSWER_PENDING":

            return ret ;

    case "PUSH_ANSWER_SUCCESS" :
            History.replace('/score?test_id=' + state.test.test_id) ;
            return ret ;

    case "RANKING_GET_PENDING" :
            
            return ret ;

    case "RANKING_GET_SUCCESS" :

            //History.replace('/ranking') ;
            return ret ;

    case "SCORE_SHARE_PENDING":
            return ret ;

    case "SCORE_SHARE_SUCCESS" :
            ret.score.test_time = action.result.test_time ;
            ret.score.score_100 = action.result.score_100 ;
            ret.score.short_comment = action.result.short_comment ;
            ret.score.comment = action.result.comment ;
            return ret ;


    case "CONF_GET_FAILURE": 
            console.log(action) ;
            return ret ;
        
    default:
        return ret ;
  }

}

export {init_state, reducer}