import React, { Component } from 'react' ;
import Image from 'react-bootstrap/lib/Image'
import Button from 'react-bootstrap/lib/Button'
import { connect } from 'react-redux'

import {cover_wrapper_state_2_props, cover_wrapper_dispatch_2_props} from './action'
import Cover from './Cover'

 class CoverWrapper extends Component {
    constructor(props) {
        super(props) ;
    }

    componentDidMount() {
         if (this.props.loading == "not_start") 
             this.props.get_conf() ;
    }

    render() {
        //var { loading, title, cover_text } = this.props ;

        let content =  (this.props.loading == "finished" ? <Cover title={this.props.title} cover_text={this.props.cover_text} /> : null) ;

        return (
                   content
            )
    }
}

export default connect(cover_wrapper_state_2_props, cover_wrapper_dispatch_2_props)(CoverWrapper) ;








    