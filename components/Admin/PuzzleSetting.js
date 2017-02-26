import React, { Component }  from 'react' ;
import ReactDOM from 'react-dom';
import Panel from 'react-bootstrap/lib/Panel'
import ListGroup from 'react-bootstrap/lib/ListGroup'
import ListGroupItem from 'react-bootstrap/lib/ListGroupItem'
import Modal from 'react-bootstrap/lib/Modal'
import FormGroup from 'react-bootstrap/lib/FormGroup'
import FormControl from 'react-bootstrap/lib/FormControl'
import InputGroup from 'react-bootstrap/lib/InputGroup'
import Button from 'react-bootstrap/lib/Button'
import Checkbox from 'react-bootstrap/lib/Checkbox'

import { query, store } from '../state'

export default class extends Component {
        constructor(props) {
            super(props) ;

            this.state = {
                    puzzles : [],
                    in_edit : -1,
                    enable : true,                    
            }
        }

        componentDidMount() {
           query('/api/admin/puzzle_all_get', {}).then(function(ret) {
                  this.setState({puzzles : ret}) ;
                  console.log(ret) ;
           }.bind(this)) ;
        }  

        modify() {
            let question = this.question.value ;
            let answer_a = this.answer_a.value ;
            let answer_b = this.answer_b.value ;
            let answer_c = this.answer_c.value ;
            let answer_d = this.answer_d.value ;
            let answer = '' ;
            if (this.refs.choose_a.checked) answer = 'a' ;
            if (this.refs.choose_b.checked) answer = 'b' ;
            if (this.refs.choose_c.checked) answer = 'c' ;
            if (this.refs.choose_d.checked) answer = 'd' ;
            let enable = this.state.enable ;


            console.log(question, answer_a, answer_b, answer_c, answer_d, answer, enable) ;
        }

    render () {
          let  content = this.state.puzzles.map(function(v, idx) {
              return (
                      <Panel key={idx} collapsible defaultExpanded header={`ID(${v.id}) ` +  v.question}>
                          
                      <ListGroup fill>
                        <ListGroupItem bsStyle={v.answer == 'a' ? "success" : "info"}>{v.a}</ListGroupItem>
                        <ListGroupItem bsStyle={v.answer == 'b' ? "success" : "info"}>{v.b}</ListGroupItem>
                        <ListGroupItem bsStyle={v.answer == 'c' ? "success" : "info"}>{v.c}</ListGroupItem>
                        <ListGroupItem bsStyle={v.answer == 'd' ? "success" : "info"}>{v.d}</ListGroupItem>
                      </ListGroup>
                       <Button type="submit" onClick={() => this.setState({in_edit : idx})}> 修改 </Button>
                       <Button type="submit" > 删除 </Button>
                        
                    </Panel>
                )
          }.bind(this)) ;


           return (
                  <div>
                      {content}

                      <div className="static-modal">

                      <Modal
                          show={this.state.in_edit >= 0}
                          onHide={() => this.setState({in_edit : -1})}
                          container={this}
                          aria-labelledby="contained-modal-title"
                        >
                          <Modal.Header closeButton>
                            <Modal.Title id="contained-modal-title">题目编辑</Modal.Title>
                          </Modal.Header>
                          <Modal.Body>
                                <form>
                                  <FormGroup>
                                  <FormControl type="text" inputRef={ref => this.question = ref}>
                                  </FormControl>
                                  </FormGroup>

                                 <FormGroup>
                                  <InputGroup>
                                    <InputGroup.Addon>
                                      <input type="radio" name="answer" aria-label="..." ref="choose_a"/>
                                    </InputGroup.Addon>
                                    <FormControl type="text" inputRef={ref => this.answer_a = ref}/>
                                  </InputGroup>

                                  <InputGroup>
                                    <InputGroup.Addon>
                                      <input type="radio" name="answer" aria-label="..." ref="choose_b"/>
                                    </InputGroup.Addon>
                                    <FormControl type="text" inputRef={ref => this.answer_b = ref}/>
                                  </InputGroup>

                                  <InputGroup>
                                    <InputGroup.Addon>
                                      <input type="radio" name="answer" aria-label="..." ref="choose_c"/>
                                    </InputGroup.Addon>
                                    <FormControl type="text" inputRef={ref => this.answer_c = ref}/>
                                  </InputGroup>

                                  <InputGroup>
                                    <InputGroup.Addon>
                                      <input type="radio" name="answer" aria-label="..." ref="choose_d" / >
                                    </InputGroup.Addon>
                                    <FormControl type="text" inputRef={ref => this.answer_d = ref}/>
                                  </InputGroup>
                                </FormGroup>

                                <Checkbox inline defaultChecked={this.state.enable} onChange={() => this.setState({enable : !this.state.enable})}>
                                  是否启用
                                </Checkbox>
                       
                                </form>

                          </Modal.Body>
                          <Modal.Footer>
                            <Button onClick={this.modify.bind(this)}>确定</Button>
                            <Button onClick={() => this.setState({in_edit : -1})}>取消</Button>
                          </Modal.Footer>
                        </Modal>
                        </div>    

                  </div>
            )

    }
}
