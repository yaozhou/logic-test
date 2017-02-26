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

import { query, store } from './state'

export default class extends Component {
        constructor(props) {
        super(props) ;

        this.state = {
        }
    }

    save() {

    }

    render () {
            let  ary = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10] ;
            let com = ary.map(function(v, idx) {
                return (
                    <FormGroup key={v}>
                      <Col componentClass={ControlLabel} sm={4}>{v}分数描述 (请分成两行,第一行简短描述，第二行详细描述)</Col>
                      <Col sm={6}> <FormControl inputRef={ref => this.test_time = ref} type="text" placeholder="" />  </Col>
                    </FormGroup>
                    )
            }.bind(this)) ;


            return (
                    <Form horizontal>
                    <FormGroup>
                      <Col componentClass={ControlLabel} sm={4}> 标题 </Col>
                      <Col sm={6}> <FormControl inputRef={ref => this.title = ref} type="text" placeholder="" />  </Col>
                    </FormGroup>

                    <FormGroup>
                      <Col componentClass={ControlLabel} sm={4}> 商品名称(会显示在微信支付凭证里) </Col>
                      <Col sm={6}> <FormControl inputRef={ref => this.product_name = ref} type="text" placeholder="" />  </Col>
                    </FormGroup>

                    <FormGroup>
                      <Col componentClass={ControlLabel} sm={4}> 商品价格(以分为单位,0为免费) </Col>
                      <Col sm={6}> <FormControl inputRef={ref => this.price = ref} type="text" placeholder="" />  </Col>
                    </FormGroup>

                    <FormGroup>
                      <Col componentClass={ControlLabel} sm={4}> 商品描述(出现在首页描述中) </Col>
                      <Col sm={6}> 
                            <FormControl inputRef={ref => this.cover_text = ref} type="text" componentClass="textarea" placeholder="" />  
                        </Col>
                    </FormGroup>                        

                    <FormGroup>
                      <Col componentClass={ControlLabel} sm={4}>题目数</Col>
                      <Col sm={6}> <FormControl inputRef={ref => this.test_num = ref} type="text" placeholder="" />  </Col>
                    </FormGroup>

                    <FormGroup>
                      <Col componentClass={ControlLabel} sm={4}>测试时间</Col>
                      <Col sm={6}> <FormControl inputRef={ref => this.test_time = ref} type="text" placeholder="" />  </Col>
                    </FormGroup>

                    {com}

                    <FormGroup>
                      <Col smOffset={4} sm={6}>
                        <Button type="submit" onClick={this.save.bind(this)}>
                          保存
                        </Button>
                      </Col>
                    </FormGroup>
                  </Form>
                )

    }
}
