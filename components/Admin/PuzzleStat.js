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
import { query, store } from '../state'

export default class extends Component {
        constructor(props) {
            super(props) ;

            this.state = {
                    puzzles : [],
            }
        }

    componentDidMount() {
         query('/api/admin/puzzle_all_get', {}).then(function(ret) {
                this.setState({puzzles : ret}) ;
                console.log(ret) ;
         }.bind(this)) ;
    }

    render () {           
         let content = this.state.puzzles.map(function(v, idx) {
             v.ratio = (v.tester_num == undefined || v.tester_num == 0 ? 'N' : (v.right_num * 100 / v.tester_num).toFixed(0) ) ;
             v.enable = (v.enable != 0) ;

              return (
                        <tr key={idx}>
                            <td>{v.id}</td>
                            <td>{v.tester_num}</td>
                            <td>{v.right_num}</td>
                            <td>{v.ratio}</td>
                            <td>{ v.enable ? "√" : "x" }</td>
                        </tr>
                )
         }) ;

          return (
                    <Table striped bordered condensed hover>
                    <thead>
                    <tr>
                    <th>#</th>
                    <th>测试次数</th>
                    <th>答对次数</th>
                    <th>正确率</th>
                    <th>是否启用</th>
                     </tr>
                    </thead>
                    <tbody>
                        {content}
                    </tbody>
                    </Table>
            )

    }
}
