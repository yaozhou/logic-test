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
import Col from 'react-bootstrap/lib/Col'
import ButtonToolbar from 'react-bootstrap/lib/ButtonToolbar'
import Well from 'react-bootstrap/lib/Well'

import { query, store } from '../state'

export default class extends Component {
        constructor(props) {
            super(props) ;

            this.state = {
                    puzzles : [],
                    in_add : false,
                    in_edit : -1,
                    enable : true,                    
            }
        }

        componentDidMount() {
           query('/api/admin/puzzle_all_get', {}).then(function(ret) {
                  this.setState({puzzles : ret}) ;
           }.bind(this)) ;
        }  

        del(idx) {
            let id = this.state.puzzles[idx].id ;

            query('/api/admin/puzzle_del', {id : id})
                .then(function(ret) {
                    if(ret.code == 0) {
                        let p = this.state.puzzles.filter((v) => v.id != id) ;
                        this.setState({puzzles : p}) ;
                    }
                }.bind(this))
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

            if (answer_a == '' || answer_b  == '' || answer_c == '' || answer_d == '' || answer == '' )  {
                alert('信息不完整') ; return ;
            }

            let q = {
                        question : question, 
                        a : answer_a,
                        b : answer_b,
                        c : answer_c,
                        d : answer_d,
                        answer : answer,
                        enable : enable ? 1 : 0,
                  } ;

            if (this.state.in_edit >= 0) 
                  q.id = this.state.puzzles[this.state.in_edit].id ;

            query('/api/admin/puzzle_set', q)
                .then(function(ret) {
                    if (this.state.in_edit >= 0) { // 修改题目
                        this.state.puzzles[this.state.in_edit] = q ;
                    }else {
                        this.state.puzzles.push(ret.detail)
                    }
                    
                    this.setState({in_edit : -1, in_add : false}) ;
                }.bind(this))

            console.log(question, answer_a, answer_b, answer_c, answer_d, answer, enable) ;
        }

    render () {
          let  content = this.state.puzzles.map(function(v, idx) {
              return (
                      <Panel key={idx} collapsible defaultExpanded header={`${v.id}: ` +  v.question}>
                          
                      <ListGroup fill>
                        <ListGroupItem bsStyle={v.answer == 'a' ? "success" : null}>{'A: ' + v.a}</ListGroupItem>
                        <ListGroupItem bsStyle={v.answer == 'b' ? "success" : null}>{'B: ' + v.b}</ListGroupItem>
                        <ListGroupItem bsStyle={v.answer == 'c' ? "success" : null}>{'C: ' + v.c}</ListGroupItem>
                        <ListGroupItem bsStyle={v.answer == 'd' ? "success" : null}>{'D: ' + v.d}</ListGroupItem>
                        </ListGroup>
                       
                       <ButtonToolbar>
                        <Button onClick={() => this.setState({in_edit : idx})}> 修改 </Button>                       
                       <Button onClick={this.del.bind(this, idx)}> 删除 </Button>
                       </ButtonToolbar>
                       
                        
                    </Panel>
                )
          }.bind(this)) ;

          let puzzle_in_edit = (this.state.in_edit >= 0 ? this.state.puzzles[this.state.in_edit] : null) ;

           return (
                  <div>                    
                      {content}
                       <Well>                      
                      <Button bsStyle="primary" onClick={() => this.setState({in_add : true}) }> {`当前共${this.state.puzzles.length}题 : 新增`} </Button>
                      </Well>

                      <div className="static-modal">

                      <Modal
                          show={this.state.in_edit >= 0 || this.state.in_add}
                          onHide={() => this.setState({in_edit : -1, in_add : false})}
                          container={this}
                          aria-labelledby="contained-modal-title"
                        >
                          <Modal.Header closeButton>
                            <Modal.Title id="contained-modal-title">题目编辑</Modal.Title>
                          </Modal.Header>
                          <Modal.Body>
                                <form>
                                  <FormGroup>
                                  <FormControl type="text" 
                                        componentClass="textarea"
                                        inputRef={ref => this.question = ref} 
                                        defaultValue={ puzzle_in_edit ? puzzle_in_edit.question : '' } >
                                  </FormControl>
                                  </FormGroup>

                                 <FormGroup>
                                  <InputGroup>
                                  <InputGroup.Addon>
                                      <input type="radio" name="answer" aria-label="..." ref="choose_a" 
                                              defaultChecked={puzzle_in_edit ? puzzle_in_edit.answer == 'a' : false} />
                                    </InputGroup.Addon>
                                    <FormControl type="text" 
                                            inputRef={ref => this.answer_a = ref}
                                            defaultValue={ puzzle_in_edit ? puzzle_in_edit.a : '' }
                                            />
                                  </InputGroup>

                                  <InputGroup>
                                    <InputGroup.Addon>
                                      <input type="radio" name="answer" aria-label="..." ref="choose_b" 
                                            defaultChecked={puzzle_in_edit ? puzzle_in_edit.answer=='b' : false} />
                                    </InputGroup.Addon>
                                    <FormControl type="text" 
                                            inputRef={ref => this.answer_b = ref}
                                            defaultValue={ puzzle_in_edit ? puzzle_in_edit.b : ''}
                                            />
                                  </InputGroup>

                                  <InputGroup>
                                    <InputGroup.Addon>
                                      <input type="radio" name="answer" aria-label="..." ref="choose_c" 
                                            defaultChecked={puzzle_in_edit ?  puzzle_in_edit.answer=='c' : false} />
                                    </InputGroup.Addon>
                                    <FormControl type="text" 
                                        inputRef={ref => this.answer_c = ref}
                                        defaultValue={ puzzle_in_edit ? puzzle_in_edit.c : '' }
                                        />
                                  </InputGroup>

                                  <InputGroup>
                                    <InputGroup.Addon>
                                      <input type="radio" name="answer" aria-label="..." ref="choose_d" 
                                            defaultChecked={puzzle_in_edit ? puzzle_in_edit.answer=='d' : false} / >
                                    </InputGroup.Addon>
                                    <FormControl type="text" 
                                            inputRef={ref => this.answer_d = ref}
                                            defaultValue= { puzzle_in_edit ? puzzle_in_edit.d : '' }
                                            />
                                  </InputGroup>
                                </FormGroup>
                                <Checkbox inline defaultChecked={puzzle_in_edit ? puzzle_in_edit.enable == 1 : false}
                                              onChange={() => this.setState({enable : !this.state.enable})}>
                                  是否启用
                                </Checkbox>                       
                                </form>

                          </Modal.Body>
                          <Modal.Footer>
                            <Button onClick={this.modify.bind(this)}>确定</Button>
                            <Button onClick={() => this.setState({in_edit : -1, in_add : false})}>取消</Button>
                          </Modal.Footer>
                        </Modal>
                        </div>    

                  </div>
            )

    }
}
