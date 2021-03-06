import React, { Component }  from 'react' ;
import Radio from 'react-bootstrap/lib/Radio'
import FormGroup from 'react-bootstrap/lib/FormGroup'
import ControlLabel from 'react-bootstrap/lib/ControlLabel'
import Carousel from 'react-bootstrap/lib/Carousel'
import Button from 'react-bootstrap/lib/Button'
import ListGroup from 'react-bootstrap/lib/ListGroup'
import ListGroupItem from 'react-bootstrap/lib/ListGroupItem'
import Label from 'react-bootstrap/lib/Label'
import Panel from 'react-bootstrap/lib/Panel'
//import Loading from 'react-loading' ;
var Loader = require('halogen/PulseLoader') ;
import { store, query } from './state'

import { useRouterHistory } from 'react-router';
import { createHashHistory } from 'history';
const History = useRouterHistory(createHashHistory)({queryKey: false}) ;

export default class Puzzle extends Component {
    constructor(props) {
        super(props) ;

        this.state = {
            test_id : 0,
            index : 0,
            puzzle : [],
            test_time : store.cover.test_time,
            left_time : store.cover.test_time,
            answer : [],
            interval : null,
            cur_answer : '',
        }
    }


    finish_test() {
        if (this.state.finished) return ;

        this.state.finished = true ;
        let param = { 
                test_id : this.state.test_id, 
                answers : this.state.answer,
                test_time : this.state.test_time - this.state.left_time } ;

        query('/api/test_finish', param).then(function(){
            History.replace('/score?test_id=' + this.state.test_id) ;
        }.bind(this)) ;
    }

    componentDidMount() {    
        query('/api/count', {type : 'test'}) ;

        query('/api/test_begin', {}).then(function(ret) {
              let a = ret.puzzle.map(function(v) {
                  return {id : v.id, answer : ''}
                }) ;

              this.setState({
                  test_id : ret.test_id,
                  puzzle : ret.puzzle,
                  answer : a,
              })

              var interval = setInterval(function() {
                    var left_time = this.state.left_time - 1 ;
                    if (left_time == 0) {
                        this.finish_test() ;
                        clearInterval(this.state.interval) ;
                    }
                    this.setState({left_time : left_time}) ;
              }.bind(this), 1000) ;

              this.setState({interval : interval}) ;
        }.bind(this))         
    }

    componentWillUnmount() {
        if (this.state.interval != null) clearInterval(this.state.interval) ;
    }

    move_forward(answer) {
        let idx = this.state.index ;
        this.state.answer[idx] = { id : this.state.puzzle[idx].id, answer : answer } ;

        if (idx + 1 == this.state.puzzle.length) {
            this.finish_test() ;
        }else {
            this.setState({index : idx + 1, cur_answer : ''}) ;
        }
        this.interval = null ;
    }

    puzzle_answer(answer) {
        if (this.interval != null) return ;
        this.setState({cur_answer : answer}) ;
        this.interval = setTimeout(this.move_forward.bind(this, answer), 500) ;
    }

    render () {        

      var m = Math.floor(this.state.left_time / 60) ;
      var s = this.state.left_time % 60 ;
      if (m < 10) m = '0' + m ;
      if (s < 10) s = '0' + s ;
      var time_str = m + ':' + s ;

//  因为button.list-group-item:hover   有阴影，所以从boot-strap的css里删掉了

      let content = null ;
      if (this.state.puzzle.length > 0) {
           let v = this.state.puzzle[this.state.index] ;
           content = (
                  <Panel>
                  <form>
                     <FormGroup>
                     <h4>{v.question}</h4>
                     </FormGroup>

                        <FormGroup >
                          <ListGroup>

                          {this.state.cur_answer == 'a' ?  (
                                    <ListGroupItem  active onClick = {this.puzzle_answer.bind(this, 'a')}>
                                    <Radio  name="puzzle" checked={true} >
                                      {v.a}
                                    </Radio>              
                                    </ListGroupItem>
                            ) : (
                                    <ListGroupItem  onClick = {this.puzzle_answer.bind(this, 'a')}>
                                    <Radio  name="puzzle"  >
                                      {v.a}
                                    </Radio>              
                                    </ListGroupItem>
                            )
                        }
                          
                        {this.state.cur_answer == 'b' ? (
                                <ListGroupItem active onClick = {this.puzzle_answer.bind(this, 'b')}>
                                <Radio name="puzzle" checked={true}>
                                  {v.b}
                                </Radio>    
                                </ListGroupItem>
                          ): (
                                <ListGroupItem onClick = {this.puzzle_answer.bind(this, 'b')}>
                                <Radio name="puzzle">
                                  {v.b}
                                </Radio>    
                                </ListGroupItem>
                          )}


                          {this.state.cur_answer == 'c' ? (
                                <ListGroupItem active onClick = {this.puzzle_answer.bind(this, 'c')}>
                                <Radio name="puzzle" checked={true}>
                                  {v.c}
                                </Radio>    
                                </ListGroupItem>
                          ): (
                                <ListGroupItem onClick = {this.puzzle_answer.bind(this, 'c')}>
                                <Radio name="puzzle">
                                  {v.c}
                                </Radio>    
                                </ListGroupItem>
                          )}

                          {this.state.cur_answer == 'd' ? (
                                <ListGroupItem active onClick = {this.puzzle_answer.bind(this, 'd')}>
                                <Radio name="puzzle" checked={true}>
                                  {v.d}
                                </Radio>    
                                </ListGroupItem>
                          ): (
                                <ListGroupItem id="answer_d" onClick = {this.puzzle_answer.bind(this, 'd')}>
                                <Radio name="puzzle">
                                  {v.d}
                                </Radio>    
                                </ListGroupItem>
                          )}                         

                            </ListGroup>

                        </FormGroup>
                        </form>
            </Panel>

            )
      }

        return (
            <div>
                {content}

                { this.state.puzzle.length > 0 ? (
                    <div>
                  <h4 className="progress"><Label>{(this.state.index+1) + '/' + this.state.puzzle.length}</Label></h4>
                  <h4 className="time">{time_str}</h4>
                  </div>
                  ) : null }

            </div>
            )
    }
}