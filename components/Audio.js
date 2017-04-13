import React, { Component }  from 'react' ;
import Tabs from 'react-bootstrap/lib/Tabs'
import Tab from 'react-bootstrap/lib/Tab'
import Image from 'react-bootstrap/lib/Image'
import Modal from 'react-bootstrap/lib/Modal'
import Button from 'react-bootstrap/lib/Button'
import Form from 'react-bootstrap/lib/Form'
import FormGroup from 'react-bootstrap/lib/FormGroup'
import FormControl from 'react-bootstrap/lib/FormControl'
import ControlLabel from 'react-bootstrap/lib/ControlLabel'
import Checkbox from 'react-bootstrap/lib/Checkbox'
import Panel from 'react-bootstrap/lib/Panel'
import Col from 'react-bootstrap/lib/Col'
import Well from 'react-bootstrap/lib/Well'
import { query, store } from './state'

// 合适的降噪效果好的耳机，一些舒缓的背景环境音隔绝办公室杂音。
//我一直听的有
//soundrown  里面有海浪，下雨，咖啡厅之类的场景音效，立体音，品质非常好。
//Rainy Mood  这个里面有高品质立体音下雨音效。
//耳朵去旅行 里面音效非常多，还可自由组合播放。
//我一般撸代码时听上面的那些和缓的环境音，debug时听摇滚..

var source = [
  'yinxiao/web/山居吟-龚一.mp3',
  'yinxiao/web/柔和海浪.mp3',
  'yinxiao/web/篝火声.wav',
  'yinxiao/web/午夜虫鸣.mp3',
  'yinxiao/web/晚上知了叫的声音.wav',
  'yinxiao/web/下雨.m4a',
  'yinxiao/web/西藏念经.wav',
  'yinxiao/web/风声.WAV',
  'yinxiao/web/咖啡厅.mp3',
  'yinxiao/web/鸟叫.mp3',
  'yinxiao/web/Midnight-Blues.mp3',
  'yinxiao/web/bird_chirping.mp3',
  'yinxiao/web/和尚念经的声音.wav',
  'yinxiao/web/火车车厢.mp3',
  'yinxiao/web/海水加海鸥的声音.wav',
  'yinxiao/web/早晨6点的公交车站.wav',
  'yinxiao/web/第101次约会.mp3',
  'yinxiao/web/夜的钢琴曲1.mp3',
  'yinxiao/web/夜的钢琴曲2.mp3',
  'yinxiao/web/夜的钢琴曲3.mp3',
  'yinxiao/web/夜的钢琴曲4.mp3',
  'yinxiao/web/夜的钢琴曲5.mp3',
  'yinxiao/web/夜的钢琴曲6.mp3',
  'yinxiao/web/夜的钢琴曲7.mp3',
  'yinxiao/web/夜的钢琴曲8.mp3',
  'yinxiao/web/夜的钢琴曲9.mp3',
  'yinxiao/web/夜的钢琴曲10.mp3',
  'yinxiao/web/午夜的萨克斯.mp3',


]

export default class extends Component {
    constructor(props) {
        super(props) ;
    }

    componentDidMount() {
      document.title = '安静地写代码'
      this.interval = setInterval(function() {
        query('/api/count', {type : 'audio'}) ;  
      }, 1000*60*5) ;      
    }

    componentWillUnmount() {
      if (this.interval != null) 
        clearInterval(this.interval) ;
    }

    render () { 
        var list = source.map(function(v,idx) {
          let n = v.split('/')[v.split('/').length-1] ;
          return (
              <Panel key={idx} header={n.split('.')[0]}>
              <audio src={v} controls loop preload="none"></audio>  
              </Panel>
            )
        })

            return (
                <div>
                    <div style={{display: 'flex', justifyContent: 'center'}}>
                    
                    <h3>安静地写代码</h3>
                    </div>                 
                    
                    <hr />
                    
                    <p>提示: 可随意组合播放各种音效哦,带上耳机效果更好.</p>
                    <a href="http://bbs.nianna.space/">社区</a>
                    
                    {list}
                     
                </div>
                                
                                 
                
                )

    }
}
