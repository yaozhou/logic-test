import React, { Component }  from 'react' ;
import Button from 'react-bootstrap/lib/Button'
import { query } from './state'
import Panel from 'react-bootstrap/lib/Panel'

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
        query('/api/count', {type : 'result'}) ;    

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
        let short_comment = null ;
        let comments = null ;
        if (this.state.score_100 != null) 
            short_comment = `${this.state.name}的分数是${this.state.score_100},用时${this.state.test_time}秒。${this.state.short_comment}`

        if (this.state.comment != null)
            comments = this.state.comment.split('\n').map(function(v) {
                return (
                    <h5>{v}</h5>
                )
            })

            content = (
                        <div>
                        <Panel header="结果评分">
                        <h4>{ short_comment}</h4>
                        <hr />
                        <h5>{ comments}</h5>
                        </Panel>
                        <Button bsStyle="success" bsSize="large" className="score_button" onClick={() => History.push('/cover')}>开始测试</Button>
                        <Button bsStyle="info" bsSize="large" className="score_button" onClick={() => History.push("/ranking")}>排行榜</Button>
                        <Button bsStyle="warning" bsSize="large" className="score_button" onClick={() => History.push('/prize')}>奖金池</Button>
                        </div>
                )

        return content ;
    }   
}


