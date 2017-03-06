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

import {Uploader } from 'react-file-upload'
import PuzzleStat from './Admin/PuzzleStat'
import AdminBasic from './Admin/AdminBasic'
import PuzzleSetting from './Admin/PuzzleSetting'
import AdminPrize from './Admin/AdminPrize'
import AdminChart from './Admin/AdminChart'
import AdminProfit from './Admin/AdminProfit'
import AdminImage from './Admin/AdminImage'
import Session from './Admin/AdminSession'
import Ranking from './Ranking'
import  Prize from './Prize'

import { query, store } from './state'


export default class extends Component {
  

    render () {        
            return (
                    <div>
                    <Col sm={1}>
                    </Col>
                    <Col sm={10}> 
                    <Tabs defaultActiveKey={1} animation={false} id="noanim-tab-example">
                            <Tab eventKey={1} title="基本设置">
                                    <AdminBasic />
                            </Tab>
                            <Tab eventKey={2} title="图片设置">
                                      <AdminImage />
                            </Tab>                                    
                            <Tab eventKey={3} title="题目正确率">
                                      <PuzzleStat />
                            </Tab>
                             <Tab eventKey={4} title="题目设置">
                                      <PuzzleSetting />
                            </Tab>
                             <Tab eventKey={5} title="已结算奖金池管理">
                                      <AdminPrize />
                            </Tab>
                            <Tab eventKey={6} title="当前累计奖金">
                                      <Prize hide_last_month={true}/>
                            </Tab>
                            <Tab eventKey={7} title="利润表">
                                      <AdminProfit />
                            </Tab>
                            <Tab eventKey={8} title="统计">
                                      <AdminChart />
                            </Tab>
                            <Tab eventKey={9} title="排行榜">
                                      <Ranking />
                            </Tab>
                            <Tab eventKey={10} title="登陆管理">
                                      <Session />
                            </Tab>

                    </Tabs>
                  </Col>
                  </div>
                )

    }
}
