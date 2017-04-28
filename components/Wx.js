import React, { Component } from 'react';
import { query, store } from './state'

var auth_url = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx26169a090dc52afc&redirect_uri=http%3A%2F%2Fwww.logictest.net%2Fmp&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect" ;


export default class Wx extends Component {
    constructor(props) {
        super(props) ;
    }

    is_weixn() {
            var ua = navigator.userAgent.toLowerCase() ;
            return (ua.match(/MicroMessenger/i) == "micromessenger") ;
    }

    componentDidMount() {
        if (this.is_weixn()) {
            window.location.href = auth_url.replace('STATE', this.props.state) ;
        }else {
             alert("请在微信浏览器中打开") ;
        }
    }

  render() {    
    return null ;
  }
}


