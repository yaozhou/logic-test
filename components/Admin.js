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
import AdminBasic from './AdminBasic'
import PuzzleSetting from './Admin/PuzzleSetting'
import { query, store } from './state'


export default class extends Component {




    render () {        
            return (
                    <Tabs defaultActiveKey={1} animation={false} id="noanim-tab-example">
                            <Tab eventKey={1} title="基本设置">
                                    <AdminBasic />
                            </Tab>
                            <Tab eventKey={2} title="图片设置">
                                      <Uploader url='/api/admin/cover_upload' checkType={true} multiple={true}/>
                            </Tab>                                    
                            <Tab eventKey={3} title="题目正确率">
                                      <PuzzleStat />
                            </Tab>
                             <Tab eventKey={4} title="题目设置">
                                      <PuzzleSetting />
                            </Tab>
                             <Tab eventKey={5} title="退出登陆">

                            </Tab>
                    </Tabs>
                )

    }
}
