import React, { Component }  from 'react' ;
import Tabs from 'react-bootstrap/lib/Tabs'
import Tab from 'react-bootstrap/lib/Tab'
import Image from 'react-bootstrap/lib/Image'
import { query } from './state'

export default class Ranking extends Component {
    constructor(props) {
        super(props) ;

        this.state = {
            pre_week : [],
            week : [],
            year : []
        }
    }

    componentDidMount() {
        query('/api/score_list', {}).then(function(ret) {
            this.setState({
                pre_week : ret.pre_week,
                week : ret.week,
                year : ret.year,
            })
        }.bind(this))
    }

    ranking_item(idx, head_img, score_100, test_time, username) {
        return <div key={idx}>
                            <span className="ranking_number">{idx+1}</span>
                            
                            {head_img == null ? null :                            
                            <Image src={head_img} className='ranking_img'/> }
                            <span className="ranking_name">{username} </span>
                            <span className="ranking_score_time">
                                    <span className="ranking_score">{score_100}</span>
                                    分(
                                    <span className="ranking_time">{test_time}</span>
                                    秒)
                            </span>
                    </div>
    }

    render () {        

        let pre_week_ary = this.state.pre_week.map(function(v, idx) {
            return this.ranking_item(idx, v.head_img, v.score_100, v.test_time, v.username) ;
        }.bind(this)) ;

        let week_ary = this.state.week.map(function(v, idx) {
            return this.ranking_item(idx, v.head_img, v.score_100, v.test_time, v.username) ;
        }.bind(this)) ;
        
        let year_ary = this.state.year.map(function(v, idx) {
           return this.ranking_item(idx, v.head_img, v.score_100, v.test_time, v.username)
        }.bind(this)) ;

        return (
                      <Tabs defaultActiveKey={1} animation={false} id="noanim-tab-example">
                            <Tab eventKey={1} title="本周排行榜">
                                    {week_ary}
                            </Tab>
                            <Tab eventKey={2} title="上周排行榜">
                                    {pre_week_ary}
                            </Tab>                                    
                            <Tab eventKey={3} title="年度排行榜">
                                    {year_ary}
                            </Tab>
                    </Tabs>
        )
    }
}
