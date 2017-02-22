import React, { Component } from 'react' ;
import Image from 'react-bootstrap/lib/Image'
import Button from 'react-bootstrap/lib/Button'
import { connect } from 'react-redux'
import { get_dynamic_action } from './action'

class Cover extends Component {
    render() {
        const { loading, title , cover_text, start_test} = this.props ;

        let content = loading != "finished" ? null :
                ( <div>
                    <Image src="img/cover.jpg" responsive />
                    <h4>{cover_text}</h4>
                    <Button bsStyle="primary" bsSize="large" onClick={start_test} block>开始测试</Button>
                </div>)

        return (content)
    }
}


function state_2_props(state) {
    return { 
            title : state.cover.title, 
            cover_text : state.cover.cover_text,
            loading : state.cover.loading,
        } ;
}

function dispatch_2_props (dispatch) {
   return { start_test : () => get_dynamic_action().start_test(dispatch) }
}


export default connect(state_2_props, dispatch_2_props)(Cover) ;