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
import Well from 'react-bootstrap/lib/Well'
import Panel from 'react-bootstrap/lib/Panel'
import { query, store } from '../state'
import { useRouterHistory } from 'react-router';
import { createHashHistory } from 'history';
const History = useRouterHistory(createHashHistory)({queryKey: false}) ;


export default class extends Component {
    constructor(props) {
        super(props) ;

        this.state = {

        }
    }

    modify_password() {
        let old_password = this.old_password.value.trim() ;
        let new_password = this.new_password.value.trim() ;
        let confirm_password = this.confirm_password.value.trim() ;
        if (old_password == '' || new_password == '' || confirm_password == '') {
            alert('请输入完整')  ; return ;
        }
        if (new_password != confirm_password) {
            alert('两次密码输入不一致') ; return ;
        }

        query('/api/admin/password_change', {old_password : old_password, new_password : new_password})
            .then(function(ret) {
                if (ret.code == 0) {
                    this.old_password.value = '' ;
                    this.new_password.value = '' ;
                    this.confirm_password.value = '' ;
                    alert('修改成功') ;
                  }
                else 
                    alert('密码错误') ;
            }.bind(this))
    }

    quit() {
        query('/api/admin/logout', {}).then(function (ret) {
              History.replace("/login") ;
        })
    }

    render () {        
            return (
                    <div>
                    <Panel header="修改密码">
                    <Form horizontal>
                    <FormGroup>
                      <Col componentClass={ControlLabel} sm={2}> 原密码 </Col>
                      <Col sm={6}>
                            <FormControl type="password" defaultValue={''} inputRef={ref => this.old_password = ref}  />                              
                      </Col>
                    </FormGroup>

                    <FormGroup>
                      <Col componentClass={ControlLabel} sm={2}>新密码</Col>
                      <Col sm={6}> 
                            <FormControl type="password" defaultValue={''} inputRef={ref => this.new_password = ref} />
                      </Col>
                    </FormGroup>

                    <FormGroup>
                      <Col componentClass={ControlLabel} sm={2}>再次输入新密码</Col>
                      <Col sm={6}> 
                            <FormControl  type="password" defaultValue={''} inputRef={ref => this.confirm_password = ref} />
                      </Col>
                    </FormGroup>

                    <FormGroup>
                     <Col componentClass={ControlLabel} sm={2}></Col>
                      <Col sm={6}> 
                             <Button onClick={this.modify_password.bind(this)}> 修改 </Button>   
                      </Col>
                    </FormGroup>

                    
                    </Form>
                    </Panel>

                    <Panel header="会话管理">
                          <FormGroup>
                          <Col componentClass={ControlLabel} sm={2}></Col>
                          <Col sm={6}> 
                                 <Button onClick={this.quit.bind(this)}> 退出登陆 </Button>
                          </Col>           
                          </FormGroup>               
                    </Panel>
                    </div>
                )

    }
}
