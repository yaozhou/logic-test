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
var range = require('range') ;

import { query, store } from '../state'

export default class extends Component {
     constructor(props) {
        super(props) ;

        this.state = {            
                title : '',
                item_name : '',
                item_price : '',
                cover_text : '',
                test_time : '',
                question_num : '',
                comment : new Array(10),
        }
     }

    save() {
        let conf = {
            title : this.state.title,
            item_name : this.state.item_name,
            item_price : this.state.item_price,
            cover_text : this.state.cover_text,
            test_time : this.state.test_time,
            question_num : this.state.question_num,            
        }
        this.state.comment.forEach((v, idx) => conf['comment' + idx] = v) ;

        console.log(conf) ;

        query('/api/admin/conf_set', conf).then(ret => alert(ret.code == 0 ? '保存成功' : '保存失败') );        

    }

    componentDidMount() {
        query('/api/conf_get', {}).then(function(ret) {
              this.state.comment = range.range(0, 11).map(v => ret['comment' + v]) ;

              this.setState({
                  title : ret.title,
                  item_name : ret.item_name,
                  item_price : ret.item_price,
                  cover_text : ret.cover_text,
                  test_time : ret.test_time,
                  question_num : ret.question_num,
              })
              
              console.log(ret) ;
        }.bind(this))
    }

    render () {
            let  ary = range.range(0, 11) ;
            let com = ary.map(function(v, idx) {
                return (
                    <FormGroup key={v}>
                      <Col componentClass={ControlLabel} sm={4}>{v}分数描述 (请分成两行)</Col>
                      <Col sm={6}> 
                          <FormControl                   
                              type="text" 
                              componentClass="textarea" 
                              value={this.state.comment[idx]}
                              onChange={(e) => {
                                  this.state.comment[idx] = e.target.value ;
                                  this.setState({comment : this.state.comment}) ;
                              }}
                              />
                      </Col>
                    </FormGroup>
                    )
            }.bind(this)) ;

            return (
                    <Form horizontal>
                    <FormGroup>
                      <Col componentClass={ControlLabel} sm={4}> 标题 </Col>
                      <Col sm={6}>
                            <FormControl            
                                      type="text"
                                      value={this.state.title}
                                      onChange={ e => this.setState({title : e.target.value}) }
                                      />                              
                      </Col>
                    </FormGroup>

                    <FormGroup>
                      <Col componentClass={ControlLabel} sm={4}> 商品名称(会显示在微信支付凭证里) </Col>
                      <Col sm={6}> 
                        <FormControl                               
                              type="text"
                              value={this.state.item_name} 
                              onChange={e => this.setState({item_name : e.target.value})}/>  
                      </Col>
                    </FormGroup>

                    <FormGroup>
                      <Col componentClass={ControlLabel} sm={4}> 商品价格(以分为单位,0为免费) </Col>
                      <Col sm={6}> 
                        <FormControl                             
                            type="text" 
                            value={this.state.item_price} 
                            onChange={e => this.setState({item_price : e.target.value})}/>
                     </Col>
                    </FormGroup>

                    <FormGroup>
                      <Col componentClass={ControlLabel} sm={4}> 首页文字 </Col>
                      <Col sm={6}> 
                            <FormControl                                 
                                type="text" 
                                componentClass="textarea" 
                                value={this.state.cover_text}
                                onChange={ e => this.setState({cover_text : e.target.value})}
                                />
                        </Col>
                    </FormGroup>                        

                    <FormGroup>
                      <Col componentClass={ControlLabel} sm={4}>题目数</Col>
                      <Col sm={6}> 
                          <FormControl                               
                              type="text" 
                              value = {this.state.question_num}
                              onChange= { e => this.setState({question_num : e.target.value}) }
                          />                          
                      </Col>
                    </FormGroup>

                    <FormGroup>
                      <Col componentClass={ControlLabel} sm={4}>测试时间</Col>
                      <Col sm={6}> 
                      <FormControl                             
                            type="text" 
                            value = {this.state.test_time}
                            onChange = { e => this.setState({test_time : e.target.value})}
                            />
                      </Col>
                    </FormGroup>

                    {com}

                    <FormGroup>
                      <Col smOffset={4} sm={6}>
                        <Button bsStyle="primary" onClick={this.save.bind(this)}>
                          保存
                        </Button>
                      </Col>
                    </FormGroup>
                  </Form>
                )

    }
}
