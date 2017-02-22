import React, { Component } from 'react';
import PageHeader from 'react-bootstrap/lib/PageHeader'
import { get_dynamic_action } from './action'
import { connect } from 'react-redux'

class Container extends Component {

    componentDidMount() {
         if (this.props.get_conf != null) 
             this.props.get_conf() ;
        if (this.props.cheat_login != null)
              this.props.cheat_login() ;
    }

  render() {

    return (
                <div>
                    <PageHeader >{this.props.title}</PageHeader>
                    { this.props.children }
                </div>
    )
  }
}


function state_2_props(state) {
    return { title : state.cover.title } ;
}

function dispatch_2_props (dispatch) {
    return { 
      get_conf : () => get_dynamic_action().get_conf(dispatch),
      cheat_login : () => get_dynamic_action().cheat_login(dispatch),
    }
}

export default connect(state_2_props, dispatch_2_props)(Container) ;