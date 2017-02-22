import React, { Component } from 'react';
import PageHeader from 'react-bootstrap/lib/PageHeader'
import { query, store } from './state'
var wx = require ('./jweixin-1.2.0.js')

export default class Container extends Component {
    constructor(props) {
        super(props) ;

        this.state = {
            title       : store.cover.title,        
        }
    }

    wx_init(user) {
        wx.error( (res) => alert(JSON.stringify(res)) ) ;

        var config = {
            debug : true,
            appId : user.config.appId,
            timestamp : user.config.timestamp,
            nonceStr : user.config.nonceStr,
            signature : user.config.signature,
            jsApiList :  [
                'chooseWXPay',
            ],
        }
        wx.config(config) ;
    }

    componentDidMount() {
        let p = null ;

        let code = this.props.location.query.code ;
        let debug = this.props.location.query.debug ;

        if (code != null) {
            p = query('/api/login_by_code', {code : code}) ;
        }else if (debug == 'true') {
            p = query('/api/login_by_cheat', {}) ;
        }

        p.then(function(ret) {            
            if (code != null)
                this.wx_init(ret) ;

            if (store.cover.title == null)
                query('http://www.logictest.net/order_notify.jsp', {"di" : "asdfasdf"}).then(function(ret) {
                    store.cover.title = ret.title ;
                    store.cover.cover_text = ret.cover_text ;
                    store.cover.item_price = ret.item_price ;
                    store.cover.test_time = ret.test_time ;

                    this.setState({title : ret.title}) ;
                }.bind(this)) ;

        }.bind(this)) ;
    }

  render() {
    
    return (
                <div>
                    <PageHeader >{this.state.title}</PageHeader>
                    { this.state.title == null ?  null : this.props.children }
                </div>
    )
  }
}


