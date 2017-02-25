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

export default class extends Component {
    constructor(props) {
        super(props) ;

        this.state = {
            pre_month : [],
            pre_year : [],
            month : [],
            year : [],
            show_diag : false,
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
                            
                            <span className="ranking_name">{username} </span>
                             {head_img == null ? null :                            
                            <Image src={head_img} className='ranking_img'/> }
                            <span>{`${last?'已获得':'将获得'}${(money/100).toFixed(2)}元`}</span>

                            <span className="ranking_score_time">
                                    <span className="ranking_score">{score_100}</span>
                                    分(
                                    <span className="ranking_time">{test_time}</span>
                                    秒)
                            </span>
                    </div>
    }

    want_money() {
        var t = this.state.pre_month.filter((v) => v.users_id == store.user.openid) ;
        if (t.length != 0) {
            alert('亲，你没有出现在名单中哦，没关系，我们努力超越') ;
        }else {
            this.setState({show_diag : true})
        }
    }

    register() {        
        
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

        return (
            <div>
                      <Tabs defaultActiveKey={1} animation={false} id="noanim-tab-example">
                            <Tab eventKey={1} title="上月奖金榜单">
                                    {pre_month_ary}
                            </Tab>
                            <Tab eventKey={2} title="本月累计奖金">
                                    {month_ary}
                            </Tab>                                    
                            <Tab eventKey={3} title="年度累计奖金">
                                    {year_ary}
                            </Tab>
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
                                <FormControl type="text">
                                </FormControl>
                                </FormGroup>
                                </form>

                          </Modal.Body>
                          <Modal.Footer>
                            <Button onClick={this.register}>确定</Button>
                            <Button onClick={() => this.setState({show_diag : false})}>取消</Button>
                          </Modal.Footer>
                        </Modal>
                        </div>                         

                    <Button bsStyle="primary" bsSize="large" className="score_button" onClick={this.want_money.bind(this)}>我要去领奖 </Button>
            </div>
        )
    }
}
