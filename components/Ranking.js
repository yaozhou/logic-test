import React, { Component }  from 'react' ;
import Tabs from 'react-bootstrap/lib/Tabs'
import Tab from 'react-bootstrap/lib/Tab'
import Image from 'react-bootstrap/lib/Image'
import Panel from 'react-bootstrap/lib/Panel'
import Button from 'react-bootstrap/lib/Button'
import { query } from './state'
var wx = require ('./jweixin-1.2.0.js')

import { useRouterHistory } from 'react-router';
import { createHashHistory } from 'history';
const History = useRouterHistory(createHashHistory)({queryKey: false}) ;

export default class Ranking extends Component {
    constructor(props) {
        super(props) ;

        this.state = {
            pre_month : [],
            cur_month : [],
            year : []
        }
    }

    componentDidMount() {
         query('/api/count', {type : 'ranking'}) ;

        query('/api/score_list', {}).then(function(ret) {
            this.setState({
                pre_month : ret.pre_month,
                cur_month : ret.cur_month,
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

    onShareTimeline() {
        alert('onShareTimeline');
        wx.onMenuShareTimeline({
            title: 'test title', // 分享标题
            link: 'http://www.logictest.net', // 分享链接
            imgUrl: 'http://www.logictest.net/img/lt.jpeg', // 分享图标
            success: function () { 
                alert('success') ;
            },
            cancel: function () { 
                alert('cancel') ;
            }
        });
    }

    render () {        

        let pre_month_ary = this.state.pre_month.map(function(v, idx) {
            return this.ranking_item(idx, v.head_img, v.score_100, v.test_time, v.username) ;
        }.bind(this)) ;

        let cur_month_ary = this.state.cur_month.map(function(v, idx) {
            return this.ranking_item(idx, v.head_img, v.score_100, v.test_time, v.username) ;
        }.bind(this)) ;
        
        let year_ary = this.state.year.map(function(v, idx) {
           return this.ranking_item(idx, v.head_img, v.score_100, v.test_time, v.username)
        }.bind(this)) ;

        return (
                <div>
                      <Tabs defaultActiveKey={1} animation={false} id="noanim-tab-example">
                            <Tab eventKey={1} title="本月排行榜(70分以上)">
                                    <Panel>
                                    {cur_month_ary}
                                    </Panel>
                            </Tab>
                            <Tab eventKey={2} title="上月排行榜(70分以上)">
                                    <Panel>
                                    {pre_month_ary}
                                    </Panel>
                            </Tab>                                    
                            <Tab eventKey={3} title="年度排行榜(70分以上)">
                                    <Panel>
                                    {year_ary}
                                    </Panel>
                            </Tab>
                    </Tabs>
                    <Button bsStyle="success" bsSize="small" className="score_button" onClick={() => History.push('/')}>我也来测下</Button>     
            </div>
        )
    }
}
