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

    upload() {
        var f = this.refs.upload.files[0] ;
        if (f.size > 1024 * 1024) {
            alert('请不要上传大于1M的图片') ; return ;
        }

       var xhr = new XMLHttpRequest() ;
        var fd = new FormData() ;

        fd.append("userPhoto", f) ;

        xhr.onreadystatechange = function(system) {
            if (this.readyState == 4) alert('上传成功, 刷新后可见') ;
            //location.reload() ;
        }.bind(xhr, this)

        xhr.open("post", "/api/admin/cover_upload", true) ;
        xhr.send(fd) ;
    }

    render () {        
            return (      
                    <div>                    
                     <Image src='/img/cover.jpg' responsive />
                     <hr />
                      <Panel header={"修改封面图片"}>
                        <input ref="upload" type="file" id="img_upload"/>
                        <Button bsStyle="primary" onClick={this.upload.bind(this)}>上传 </Button>
                      </Panel>                    
                    </div>
                )

    }
}
