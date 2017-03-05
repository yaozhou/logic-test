import React, { Component } from 'react' ;
import Image from 'react-bootstrap/lib/Image'
import Button from 'react-bootstrap/lib/Button'
import { store, query } from './state'
var wx = require ('./jweixin-1.2.0.js')

import { useRouterHistory } from 'react-router';
import { createHashHistory } from 'history';
const History = useRouterHistory(createHashHistory)({queryKey: false}) ;

export default class Cover extends Component {
    constructor(props) {
        super(props) ;
        this.state = {
            cover_text : store.cover.cover_text,
            item_price : store.cover.item_price,
        }
    }

    componentDidMount() {
        query('/api/count', {type : 'cover'}) ;        
    }

    start_test() {
        if (this.state.item_price == 0)
            History.replace("/puzzle") ;
        else {
            query('/api/build_order', {}).then(function(ret) {
                    //alert(JSON.stringify(ret)) ;
                    var detail = ret.detail ;

                    wx.chooseWXPay({
                        timestamp : detail.timestamp,
                        nonceStr : detail.nonceStr,
                        package : detail.package,
                        signType : detail.signType,
                        paySign : detail.paySign,
                        success:  (res) => {
                            if (res.errMsg = "chooseWXPay:ok") 
                                History.replace("/puzzle")
                        }
                    })
            })
        }
    }

    render() {
        let content = null ;
        if (this.state.cover_text != null)  {
            let ary = this.state.cover_text.split('\n').map((text, idx) => (<div key={idx}>{text}</div>))

            content = ( <div>
                                    <Image src="img/cover.jpg" responsive />
                                    <h4>{ary}</h4>
                                    <Button bsStyle="primary" bsSize="large" onClick={this.start_test.bind(this)} block>开始测试</Button>
                                </div>)
        }

        return (content)
    }
}