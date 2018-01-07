import React, { Component }  from 'react' ;
import Tabs from 'react-bootstrap/lib/Tabs'
import Tab from 'react-bootstrap/lib/Tab'
import Image from 'react-bootstrap/lib/Image'
import Modal from 'react-bootstrap/lib/Modal'
import Button from 'react-bootstrap/lib/Button'
import FormGroup from 'react-bootstrap/lib/FormGroup'
import FormControl from 'react-bootstrap/lib/FormControl'
import Alert from 'react-bootstrap/lib/Alert'
import { query, store } from './state'

import { useRouterHistory } from 'react-router';
import { createHashHistory } from 'history';
const History = useRouterHistory(createHashHistory)({queryKey: false}) ;

export default class extends Component {
    constructor(props) {
        super(props) ;

        this.state = {
            pre_month : [],
            pre_year : [],
            month : [],
            year : [],
            show_diag : false,
            want_money_month : true
        }
    }

    componentDidMount() {
        query('/api/prize_money', {}).then(function(ret) {
            console.log(ret) ;
            this.setState({
                month : ret.month_ranking,
                year : ret.year_ranking,
            })
        }.bind(this))

        query('/api/last_prize', {}).then(function(ret) {
            console.log(ret) ;
            this.setState({pre_month : ret.last_month, pre_year : ret.last_year}) ;
        }.bind(this))
    }

    ranking_item(idx, head_img, score_100, test_time, username, money, last) {
        return <div key={idx}>

                            <span className="ranking_number">{idx+1}</span>
                            
                            {head_img == null ? null :                            
                            <Image src={head_img} className='ranking_img'/> }
                            <span className="ranking_name">{username} </span>
                             
                            <span>{`${last?'已获得':'将获得'}${(money/100).toFixed(2)}元`}</span>

                            <span className="ranking_score_time">
                                    <span className="ranking_score">{score_100}</span>
                                    分(
                                    <span className="ranking_time">{test_time}</span>
                                    秒)
                            </span>
                    </div>
    }

    want_last_month_money() {
        this.want_money(true)
    }

    want_last_year_money() {
        this.want_money(false)
    }

    want_money(is_last_month) {
        query('/api/whoami', {}).then(function(ret) {
                console.log('my openid : ' + ret.user) ;
                let openid = ret.user ? ret.user.openid : '' ;
                var prize_list = is_last_month ? this.state.pre_month : this.state.pre_year;

                var t = prize_list.filter((v) => v.users_id == openid) ;
                if (t.length == 0) {
                    //alert('openid=' + ret.user.openid + ',亲，你是 你没有出现在名单中哦，没关系，我们努力超越') ;
                    alert('亲, 你没有出现在名单中哦，没关系，我们努力超越') ;
                }else {
                    this.setState({show_diag : true, want_money_month : is_last_month})
                }
        }.bind(this))       
    }

    register() {
        let prize_list = this.state.is_last_month ? this.state.pre_month : this.state.pre_year;
        let r = prize_list.find((v) => v.users_id == store.user.openid) ;
        console.log(r) ;
        if (r) {
            query('/api/prize_mark', {id : r.prize_id, mark : this.contact.value.trim()})
                .then((ret) => {
                    this.setState({show_diag : false}) ;
                    alert('提交成功! 我们会尽快与您联系.')                    
                }) ;
        }
    }

    render () {        

        let pre_month_ary = this.state.pre_month.map(function(v, idx) {
            return this.ranking_item(idx, v.users_head_img, v.test_score_100, v.test_test_time, v.users_username, v.prize_money, true) ;
        }.bind(this)) ;

        let month_ary = this.state.month.map(function(v, idx) {
            return this.ranking_item(idx, v.head_img, v.score_100, v.test_time, v.username, v.money) ;
        }.bind(this)) ;
        
        let year_ary = this.state.year.map(function(v, idx) {
           return this.ranking_item(idx, v.head_img, v.score_100, v.test_time, v.username, v.money)
        }.bind(this)) ;

         let pre_year_ary = this.state.pre_year.map(function(v, idx) {
            return this.ranking_item(idx, v.users_head_img, v.test_score_100, v.test_test_time, v.users_username, v.prize_money, true) ;
        }.bind(this)) ;

        return (
            <div>
                      <Tabs defaultActiveKey={1} animation={false} id="noanim-tab-example">

                            <Tab eventKey={1} title="本月动态奖金">
                                    {month_ary}
                            </Tab>                                    
                            <Tab eventKey={2} title="年度动态奖金">
                                    {year_ary}
                            </Tab>
                            { !this.props.hide_last_month ? (
                            <Tab eventKey={3} title="上月奖金榜单">
                                    {pre_month_ary}
                                    <Button bsStyle="primary" bsSize="small" className="score_button" onClick={this.want_last_month_money.bind(this)}>我要去领奖 </Button>
                            </Tab> ) : 
                                null }

                            { !this.props.hide_last_month ?  (
                                <Tab eventKey={4} title="去年奖金榜单">
                                    {pre_year_ary}
                                    <Button bsStyle="primary" bsSize="small" className="score_button" onClick={this.want_last_year_money.bind(this)}>我要去领奖 </Button>
                                </Tab> ) : 
                                null }
                    </Tabs>
                    
                    <div className="static-modal">
                      <Modal
                          show={this.state.show_diag}
                          onHide={() => this.setState({show_diag : false})}
                          container={this}
                          aria-labelledby="contained-modal-title"
                        >
                          <Modal.Header closeButton>
                            <Modal.Title id="contained-modal-title">请输入您的微信号</Modal.Title>
                          </Modal.Header>
                          <Modal.Body>
                                <form>
                                <FormGroup>
                                <FormControl type="text" inputRef={ref => this.contact = ref}>
                                </FormControl>
                                </FormGroup>
                                </form>

                          </Modal.Body>
                          <Modal.Footer>
                            <Button onClick={this.register.bind(this)}>确定</Button>
                            <Button onClick={() => this.setState({show_diag : false})}>取消</Button>
                          </Modal.Footer>
                        </Modal>
                        </div>                         
            <Button bsStyle="success" bsSize="small" className="score_button" onClick={() => History.push('/')}>我也来测下</Button>

            </div>
        )
    }
}
