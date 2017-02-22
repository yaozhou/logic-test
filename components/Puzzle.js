import React, { Component }  from 'react' ;
import Radio from 'react-bootstrap/lib/Radio'
import FormGroup from 'react-bootstrap/lib/FormGroup'
import ControlLabel from 'react-bootstrap/lib/ControlLabel'
import Carousel from 'react-bootstrap/lib/Carousel'
import Button from 'react-bootstrap/lib/Button'
import ListGroup from 'react-bootstrap/lib/ListGroup'
import ListGroupItem from 'react-bootstrap/lib/ListGroupItem'
import Label from 'react-bootstrap/lib/Label'

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
        }
    }

    finish_test() {
        let param = { 
                test_id : this.state.test_id, 
                answers : this.state.answer,
                test_time : this.state.test_time - this.state.left_time } ;

        query('/api/test_finish', param).then(function(){
            History.replace('/score?test_id=' + this.state.test_id) ;
        }.bind(this)) ;
    }

    componentDidMount() {
        query('/api/test_begin', {}).then(function(ret) {
              this.setState({
                  test_id : ret.test_id,
                  puzzle : ret.puzzle,
                  answer : new Array(ret.puzzle.length),                  
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

    puzzle_answer(index, o) {
        this.state.answer[this.state.index] = { id : this.state.puzzle[index].id, answer : o } ;

        if (this.state.index + 1 == this.state.puzzle.length) {
            this.finish_test() ;
        }else {
            var next = this.state.index + 1 > this.state.puzzle.length ? 0 : this.state.index +  1 ;
            this.setState({index : next}) ;
        }
    }

    render () {
        var ary = this.state.puzzle.map(function(v, idx) {
            return (
                 <Carousel.Item key={idx}>
                 <form>
                     <FormGroup>
                     <h4>{v.question}</h4>
                     </FormGroup>
                        <FormGroup >
                          <ListGroup>


                          <ListGroupItem  className="question_item">
                          <Radio  name="puzzle" onClick = {this.puzzle_answer.bind(this, this.state.index, 'a')} >
                            {v.a}
                          </Radio>              
                          </ListGroupItem>

                           <ListGroupItem  className="question_item">
                          <Radio name="puzzle" onClick = {this.puzzle_answer.bind(this, this.state.index, 'b')}>
                            {v.b}
                          </Radio>    
                          </ListGroupItem>

                           <ListGroupItem className="question_item">
                          <Radio name="puzzle" onClick = {this.puzzle_answer.bind(this, this.state.index, 'c')}>
                            {v.c}
                          </Radio>
                          </ListGroupItem>

                           <ListGroupItem  className="question_item">
                          <Radio name="puzzle" onClick = {this.puzzle_answer.bind(this, this.state.index, 'd')}>
                            {v.d}
                          </Radio>
                          </ListGroupItem>

                            </ListGroup>

                        </FormGroup>
                        </form>
                  </Carousel.Item>
              )
        }.bind(this))

       var m = Math.floor(this.state.left_time / 60) ;
      var s = this.state.left_time % 60 ;
      if (m < 10) m = '0' + m ;
      if (s < 10) s = '0' + s ;
      var time_str = m + ':' + s ;

        return (
            <div>
            <Carousel controls={false} activeIndex={this.state.index} >
                  {ary}
            </Carousel>
            <h4 className="progress"><Label>{(this.state.index+1) + '/' + this.state.puzzle.length}</Label></h4>
            <h4 className="time">{time_str}</h4>
            </div>
            )
    }
}