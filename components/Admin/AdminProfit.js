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
import Moment from 'moment'

export default class extends Component {
    constructor(props) {
        super(props) ;

        this.state = {
            pre_month : [],
            cur_month : [],
        }
    }

    componentDidMount() {
        var pre_month_start = new Moment().startOf('month').subtract(1, 'days').startOf('month').format('YYYY-MM-DD') ;
        var pre_month_end = new Moment().startOf('month').subtract(1, 'days').format('YYYY-MM-DD') ;

        var cur_month_start = new Moment().startOf('month').format('YYYY-MM-DD') ;
        var cur_month_end = new Moment().endOf('month').format('YYYY-MM-DD') ;

        query('/api/profit_list', {start : pre_month_start, end : pre_month_end}).then(function(ret) {
            this.setState({pre_month : ret}) ;
            console.log(ret) ;
        }.bind(this))

        query('/api/profit_list', {start : cur_month_start, end : cur_month_end}).then(function(ret) {
            this.setState({cur_month : ret}) ;
            console.log(ret) ;
        }.bind(this))
    }    


    profit(profit_list) {
      let ary = profit_list.map(function(v, idx) {
          return (
              <tr key={idx}>
              <td>{v.transaction_id}</td>
              <td>{v.out_trade_no}</td>
              <td>{(v.total_fee / 100).toFixed(2)}</td>
              <td>{v.openid}</td>
              <td>{v.create_time}</td>
              </tr>
          )
      }) ;
      let total = profit_list.reduce((acc, val) => acc+val.total_fee, 0) ;

      ary.push( (
              <tr key={profit_list.length}>
              <td></td>
              <td></td>
              <td>{'共计: ' + ( total / 100).toFixed(2)}</td>
              <td></td>
              <td></td>
              </tr>
        )
      )

      return (
          <Table striped bordered condensed hover>
          <thead>
          <tr>
          <th>微信支付流水号</th>
          <th>订单号</th>
          <th>金额</th>
          <th>用户openid</th>
          <th>时间</th>       
          </tr>
          </thead>
        <tbody>
            {ary}
            </tbody>
          </Table>
          ) ;
    }

    render () {
            let pre_month_profit = this.profit(this.state.pre_month) ;
            let cur_month_profit = this.profit(this.state.cur_month) ;

            return (
                      <Tabs defaultActiveKey={1} animation={false} id="noanim-tab-example">
                            <Tab eventKey={1} title="本月盈利">
                                    {cur_month_profit}
                            </Tab>
                            <Tab eventKey={2} title="上月盈利">
                                    {pre_month_profit}
                            </Tab>                                    
                            
                    </Tabs>                 
                )
    }

}
