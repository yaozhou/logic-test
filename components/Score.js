import React, { Component }  from 'react' ;
import Button from 'react-bootstrap/lib/Button'
import { connect } from 'react-redux'
import { query } from './state'

import { useRouterHistory } from 'react-router';
import { createHashHistory } from 'history';
const History = useRouterHistory(createHashHistory)({queryKey: false}) ;

export default class Score extends Component {

    constructor(props) {
        super(props) ;

        this.state = {
            score_100 : null,
            test_time : null,
            short_comment : null,
            comment : null
        }
    }

    componentDidMount() {
        query('/api/score_share', {test_id : this.props.location.query.test_id}).then(function(ret) {
                this.setState({
                    name : ret.name,
                    score_100 : ret.score_100,
                    test_time : ret.test_time,
                    short_comment : ret.short_comment,
                    comment : ret.comment,
                })
        }.bind(this))
    }


    render() {
        let content = null ;
        if (this.state.score_100 != null) 
            var short_comment = `${this.state.name}的分数是${this.state.score_100},用时${this.state.test_time}秒。${this.state.short_comment}`

            content = (
                        <div>
                        <div className='short_comment'>{ short_comment}</div>
                        <h5>{ this.state.comment}</h5>

                        <Button bsStyle="primary" bsSize="large" className="score_button" onClick={() => History.push('/cover')}>开始测试</Button>
                        <Button bsStyle="primary" bsSize="large" className="score_button" onClick={() => History.push("/ranking")}>排行榜</Button>
                        <Button bsStyle="primary" bsSize="large" className="score_button">关注公众号</Button>
                        </div>
                )

        return content ;
    }   
}


