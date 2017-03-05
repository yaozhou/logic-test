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

import Moment from 'moment'
import {Uploader } from 'react-file-upload'
import { query, store } from '../state'
var range = require("range") ;

var ReactHighcharts = require('react-highcharts') ;
var STAT_DAYS = 30 ;

export default class extends Component {
    constructor(props) {
        super(props) ;

        this.state = {
              result : [],
        }
    }

    parse_result(visit) {


        return result ;
    }



    componentDidMount() {
         let from = new Moment().subtract(STAT_DAYS-1, 'days').format('YYYY-MM-DD') ;
         let to = new Moment().format('YYYY-MM-DD') ;

         query('/api/admin/query_stat', {from, to}).then(function(visit) {

            let result = range.range(-STAT_DAYS+1, 1).map(function(v) {

                    let stat = {day : Moment().add(v, 'days').format('YYYY-MM-DD') } ;
                    stat.cover_num = visit.filter(v =>  (v.time.split(' ')[0] == stat.day && v.view_type == 'cover')).length ;
                    stat.test_num = visit.filter((v) => (v.time.split(' ')[0] ==  stat.day && v.view_type == 'test')).length ;
                    stat.result_num = visit.filter((v) => (v.time.split(' ')[0] ==  stat.day && v.view_type == 'result')).length ;
                    stat.ranking_num = visit.filter((v) => (v.time.split(' ')[0] ==  stat.day && v.view_type == "ranking")).length ;

                    return stat ;
          }) ;

          this.setState({result : result}) ;

         }.bind(this))
    }

    render () {       

      let config = {
                title: {
                    text: '最近30天日访问次数',
                    x: -20 //center
                },
                subtitle: {
                    text: '',
                    x: -20
                },
                xAxis: {
                    categories : this.state.result.map(v => v.day),
                },
                yAxis: {
                    title: {
                        text: '访问次数'
                    },
                    plotLines: [{
                        value: 0,
                        width: 1,
                        color: '#808080'
                    }]
                },
                tooltip: {
                    valueSuffix: '次'
                },
                legend: {
                    layout: 'vertical',
                    align: 'right',
                    verticalAlign: 'middle',
                    borderWidth: 0
                },
                series: [{
                    name: '封面页',
                    data : this.state.result.map(v => v.cover_num),
                }, {
                    name: '测试页',
                    data : this.state.result.map(v => v.test_num),
                }, {
                    name: '分数页',
                    data : this.state.result.map(v => v.result_num),               
                }, {
                    name: '排行页',
                    data : this.state.result.map(v => v.ranking_num),                    
                }]
            }

            return (
                    <div>
                        <ReactHighcharts config={config} />
                    </div>
                )

    }
}
