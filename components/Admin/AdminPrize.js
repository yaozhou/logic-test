import React, { Component }  from 'react' ;
import Tabs from 'react-bootstrap/lib/Tabs'
import Tab from 'react-bootstrap/lib/Tab'
import Image from 'react-bootstrap/lib/Image'
import Modal from 'react-bootstrap/lib/Modal'
import Button from 'react-bootstrap/lib/Button'
import Form from 'react-bootstrap/lib/Form'
import FormGroup from 'react-bootstrap/lib/FormGroup'
import FormControl from 'react-bootstrap/lib/FormControl'
import ControlLabel from 'react-bootstrap/lib/ControlLabel'
import Checkbox from 'react-bootstrap/lib/Checkbox'
import Col from 'react-bootstrap/lib/Col'
import Table from 'react-bootstrap/lib/Table'

import {Uploader } from 'react-file-upload'
import { query, store } from '../state'

export default class extends Component {
    constructor(props) {
        super(props) ;

        this.state = {
            in_edit : -1,
            prize: [],
        }
    }

    componentDidMount() {
        query('/api/last_prize', {}).then(function(ret) {
            this.setState({prize : ret.last_month}) ;
        }.bind(this))
    }

    modify() {
        let mark = this.mark.value.trim() ;
        let id = this.state.prize[this.state.in_edit].prize_id ;

        query('/api/admin/prize_mark', {id : id, mark : mark}).then(function(ret) {
            if (ret.code == 0) {
                this.state.prize[this.state.in_edit].prize_admin_mark = mark ;
                //this.setState({prize : this.state.prize}) ;
            }
            this.setState({in_edit : -1}) ;
        }.bind(this))
    }

    render () {
            let content = this.state.prize.map(function(v, idx) {
                  return (            
                            <tr key={idx+1}>
                                  <td>{v.prize_date}</td>
                                  <td>{v.prize_ranking+1}</td>
                                  <td><Image src={v.users_head_img} className='ranking_img'/></td>
                                  <td>{v.users_username}</td>
                                  <td>{v.users_id}</td>
                                  <td>{v.test_test_time}</td>
                                  <td>{v.test_start_time}</td>
                                  <td>{v.test_score_100}</td>
                                  <td>{v.prize_money}</td>
                                  <td>{v.prize_user_mark} </td>
                                  <td>{v.prize_admin_mark} 
                                  <Button onClick={() => {
                                    this.setState({in_edit : idx})
                                  }}>修改</Button>
                                  </td>
                            </tr>            
                    )
            }.bind(this))

            return (
                    <div>
                    <Table striped bordered condensed hover>
                    <thead>
                    <tr>
                    <th>时间</th>
                    <th>名次</th>
                    <th>头像</th>
                    <th>昵称</th>
                    <th>openid</th>
                    <th>测试时长</th>
                    <th>测试时间</th>
                    <th>分数</th>
                    <th>奖金</th>
                    <th>用户备注</th>
                    <th>管理员备注</th>
                     </tr>
                    </thead>
                    <tbody>
                        {content}
                    </tbody>
                    </Table>

                    <div className="static-modal">
                      <Modal
                          show={this.state.in_edit >= 0}
                          onHide={() => this.setState({in_edit : -1})}
                          container={this}
                          aria-labelledby="contained-modal-title"
                        >
                          <Modal.Header closeButton>
                            <Modal.Title id="contained-modal-title">输入备注</Modal.Title>
                          </Modal.Header>
                          <Modal.Body>
                                <form>
                                <FormGroup>
                                <FormControl type="text" inputRef={ref => this.mark = ref} 
                                      defaultValue={this.state.in_edit >= 0 ? this.state.prize[this.state.in_edit].prize_admin_mark : ''} >
                                </FormControl>
                                </FormGroup>
                                </form>

                          </Modal.Body>
                          <Modal.Footer>
                            <Button onClick={this.modify.bind(this)}>确定</Button>
                            <Button onClick={() => this.setState({in_edit : -1})}>取消</Button>
                          </Modal.Footer>
                        </Modal>
                        </div>

                    </div>
                )

    }
}
