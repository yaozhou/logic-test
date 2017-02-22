import React, { Component }  from 'react' ;
import Radio from 'react-bootstrap/lib/Radio'
import FormGroup from 'react-bootstrap/lib/FormGroup'
import ControlLabel from 'react-bootstrap/lib/ControlLabel'
import Carousel from 'react-bootstrap/lib/Carousel'
import Button from 'react-bootstrap/lib/Button'
import { get_dynamic_action } from './action'
import { connect } from 'react-redux'

class Puzzle extends Component {
    constructor(props) {
        super(props) ;

        this.state = {
            index : 0,
            left_time : this.props.test_time,
            answer : new Array(this.props.puzzle.length),
            interval : null,
        }
    }

    componentDidMount() {
         var interval = setInterval(function() {
              var left_time = this.state.left_time - 1 ;
              if (left_time == 0) {
                  this.props.report_answer(this.props.test_id, this.state.answer, this.props.test_time - this.state.left_time) ;
              }
              clearInterval(this.state.interval) ;
         }.bind(this), 1000) ;

         this.setState({interval : interval}) ;
    }

    componentWillUnmount() {
        if (this.state.interval != null) clearInterval(this.state.interval) ;
    }

    puzzle_answer(index, o) {
        this.state.answer[this.state.index] = { id : this.props.puzzle[index].id, answer : o } ;

        if (this.state.index + 1 == this.props.puzzle.length) { // finish test
            this.props.report_answer(this.props.test_id, this.state.answer, this.props.test_time - this.state.left_time) ;
        }else {
            var next = this.state.index + 1 > this.props.puzzle.length ? 0 : this.state.index +  1 ;
            this.setState({index : next}) ;
        }
    }

    render () {
        const { puzzle, left_time, test_time } = this.props ;

        var ary = puzzle.map(function(v, idx) {
            return (
                 <Carousel.Item key={idx}>
                 <form>
                     <FormGroup>
                        <ControlLabel>{v.question}</ControlLabel>
                     </FormGroup>
                        <FormGroup>                          
                          <Radio  name="puzzle" onClick = {this.puzzle_answer.bind(this, this.state.index, 'a')} >
                            {v.a}
                          </Radio>                  
                          <Radio name="puzzle" onClick = {this.puzzle_answer.bind(this, this.state.index, 'b')}>
                            {v.b}
                          </Radio>                  
                          <Radio name="puzzle" onClick = {this.puzzle_answer.bind(this, this.state.index, 'c')}>
                            {v.c}
                          </Radio>
                          <Radio name="puzzle" onClick = {this.puzzle_answer.bind(this, this.state.index, 'd')}>
                            {v.d}
                          </Radio>
                        </FormGroup>
                        </form>
                  </Carousel.Item>
              )
        }.bind(this))

        return (

            <div>
            <Carousel controls={false} activeIndex={this.state.index} >
                  {ary}
            </Carousel>
            </div>
            )
    }
}

function state_2_props(state) {
    return { 
        puzzle : state.test.puzzles,
        test_id : state.test.test_id,
        test_time : state.cover.test_time,
    } ;
}

function dispatch_2_props(dispatch) {
    return { report_answer : get_dynamic_action().report_answer(dispatch) }
}

export default connect(state_2_props, dispatch_2_props)(Puzzle) ;