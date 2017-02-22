import React, { Component }  from 'react' ;
import Tabs from 'react-bootstrap/lib/Tabs'
import Tab from 'react-bootstrap/lib/Tab'
import Image from 'react-bootstrap/lib/Image'
import { connect } from 'react-redux'
import { get_dynamic_action } from './action'

class Ranking extends Component {
    componentDidMount() {
        if (this.props.get_week_ranking != null) 
            this.props.get_week_ranking() ;
        if (this.props.get_week_pre_ranking != null)
            this.props.get_week_pre_ranking() ;
        if (this.props.get_year_ranking != null)
            this.props.get_year_ranking() ;
    }

    render () {
        const { week_pre, week, year } = this.props ;

        let week_pre_ary = week_pre.map(function(v, idx) {
            return <div><span>(v.idx+1)</span><Image src={v.head_img}/><span>{v.score_100}分</span><span>{v.test_time}秒</span></div>
        }) ;

        let week_ary = week.map(function(v, idx) {
              return <div><span>(v.idx+1)</span><Image src={v.head_img}/><span>{v.score_100}分</span><span>{v.test_time}秒</span></div>
        }) ;

        let year_ary = year.map(function(v, idx) {
              return  <div><span>(v.idx+1)</span><Image src={v.head_img}/><span>{v.score_100}分</span><span>{v.test_time}秒</span></div>
        }) ;

        return (
            <div>
                      <Tabs defaultActiveKey={1} animation={false} id="noanim-tab-example">
                            <Tab eventKey={1} title="本周排行榜">
                                    {week_pre_ary}
                            </Tab>
                            <Tab eventKey={2} title="上周排行榜">
                                    {week_ary}
                            </Tab>                                    
                            <Tab eventKey={3} title="年度排行榜">
                                    {year_ary}
                            </Tab>
                    </Tabs>
            </div>
        )
    }
}

function state_2_props(state) {
    return { 
        week_pre : state.ranking.week_pre,
        week : state.ranking.week,
        year : state.ranking.year,
    } ;
}

function dispatch_2_props(dispatch) {
    return { 
        get_week_ranking : () => get_dynamic_action().get_week_ranking(dispatch),
        get_week_pre_ranking : () =>  get_dynamic_action().get_week_pre_ranking(dispatch),
        get_year_ranking : () => get_dynamic_action().get_year_ranking(dispatch),
    }
}

export default connect(state_2_props, dispatch_2_props)(Ranking) ;