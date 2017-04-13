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
        store.user = user ;

        wx.error( (res) => alert(JSON.stringify(res)) ) ;

        var config = {
            debug : false,
            appId : user.config.appId,
            timestamp : user.config.timestamp,
            nonceStr : user.config.nonceStr,
            signature : user.config.signature,
            jsApiList :  [
                'chooseWXPay',
            //    'onMenuShareTimeline',
            ],
        }
        wx.config(config) ;
    }

    componentDidMount() {
        let p = null ;

        let code = this.props.location.query.code ;
        let debug = this.props.location.query.debug ;        
        
        if (code != null) {
            p = query('http://www.logictest.net/api/login_by_code', {code : code}) ;
        }else if (debug == 'true') {
            p = query('/api/login_by_cheat', {}).then(function(ret) {                
                store.user = ret ;
            }) ;
        }
        
        function process_conf() {
            if (store.cover.title == null) {
                query('/api/conf_get', {}).then(function(ret) {                    
                    store.cover.title = ret.title ;
                    store.cover.cover_text = ret.cover_text ;
                    store.cover.item_price = ret.item_price ;
                    store.cover.test_time = ret.test_time ;

                    this.setState({title : ret.title}) ;
                }.bind(this))
                //.catch((err) => alert(err)) ;
            }            
        }
           
        if (p != null) {
            if (code != undefined)
                p.then((ret) => this.wx_init(ret)).then(process_conf.bind(this)) ;
            else 
                p.then(process_conf.bind(this)) ;
        }
        else
            process_conf.bind(this)() ;
    }

  render() {
    
    return (
                <div>
                    <div style={{display: 'flex', justifyContent: 'center'}}>
                    <h3>{this.state.title}</h3>
                    </div>
                    <hr />
                    { this.state.title == null ?  null : this.props.children } 
                </div>
    )
  }
}


