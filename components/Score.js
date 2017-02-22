import React, { Component }  from 'react' ;
import Button from 'react-bootstrap/lib/Button'
import { connect } from 'react-redux'
import { get_dynamic_action } from './action'

class Score extends Component {

    componentDidMount() {
        if (this.props.get_score != null)
            this.props.get_score(this.props.location.query.test_id) ;
    }


    render() {
        const { score_100, test_time, short_comment, comment, ranking, test_from_share } = this.props ;

        return (
            
            <div>
                <h4>{short_comment}</h4>
                <h5>{comment}</h5>

                <Button bsStyle="primary" bsSize="large"  onClick={test_from_share}>开始测试</Button>
                <Button bsStyle="primary" bsSize="large"  onClick={ranking}>排行榜</Button>
                <Button bsStyle="primary" bsSize="large"  >关注公众号</Button>
                
            </div>
        )
    }   
}

function state_2_props(state) {
    return { 
        score_100 :  state.score.score_100,
        test_time  : state.score.test_time,
        short_comment : state.score.short_comment,
        comment : state.score.comment,
    } ;
}

function dispatch_2_props(dispatch) {
    return { 
        ranking : () => get_dynamic_action().get_ranking(dispatch),
        test_from_share : () => get_dynamic_action().test_from_share(dispatch),
        get_score : get_dynamic_action().get_score(dispatch),
    }
}

export default connect(state_2_props, dispatch_2_props)(Score) ;

