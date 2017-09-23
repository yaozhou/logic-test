// 微信支付商户号
// 1433643802
// 商户平台登录帐号
// 1433643802@1433643802
// 商户平台登录密码
// 332555
// 申请对应的公众号
// 情智测评（logictest）
// 公众号APPID
// wx26169a090dc52afc
// 公众号  logictes
// zhangzhou123

//key = 524c6a1d1b94c6b5a9cebaacbe81083c

// 跳坑指南  一定要设置支付目录，在公众号内,否则无提示失败



var URL = "http://pay.163.gg/api/TradeOrder_createOrder" ;

var express = require('express') ;
var app = express() ;
var bodyParser = require('body-parser') ;
require('body-parser-xml')(bodyParser);
var express_session = require('express-session') ;
var md5 = require('MD5') ;
var sha1 = require('sha1') ;
var request = require('request') ;
var async = require('async') ;
var multer  =   require('multer');
var exec = require('child_process').exec ;
var sqlite3 = require('sqlite3').verbose() ;
var Moment = require('moment') ;
Moment.locale('cn', {week:{dow:1}}) ;  // 设置从星期一开始算一个星期
var compression = require('compression')

var xml2js = require('xml2js') ;
var random_string = require('randomstring') ;
var later = require('later') ;





// 微信相关
var APP_ID = 'wx26169a090dc52afc' ;
var APP_SECRET = '93a567fabc63fd30ba0010bda1200a72' ;
var APP_TOKEN = {"access_token":"", "expires_in":7200} ;
var APP_TICKET = {"errcode":0,"errmsg":"ok","ticket":"","expires_in":7200}
var ORDER_URL = 'https://api.mch.weixin.qq.com/pay/unifiedorder' ;
var MCH_ID = "1433643802"
var MCH_KEY = "524c6a1d1b94c6b5a9cebaacbe81083c" ;
var PRICE = 1 ;

var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');

    next() ;
}


// 各种中间件
app.use(allowCrossDomain);
app.use(bodyParser.json('2mb')) ;
app.use(bodyParser.urlencoded({extended: true})) ;
app.use(bodyParser.xml());
app.use(express_session({ secret: 'keyboard cat', resave:false, saveUninitialized: false }))
app.use(compression({threshold: 300 * 1024})) ;
app.use(express.static('static')) ;

// 上传中间件
var storage =   multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, './uploads');
  },
  filename: function (req, file, callback) {
    callback(null, file.fieldname + '-' + Date.now());
  }
}) ;
// var upload = multer({ storage : storage}).single('userPhoto');
var upload = multer({ storage : storage}).array('userPhoto', 20) ;



// 数据库
var db = new sqlite3.Database('./res/we.db') ;
var knex = require('knex')({
    client: 'sqlite3',
    connection: {filename : "res/we.db"},
    // fixme, 默认值未支持
    useNullAsDefault:true
});

function sql_promise(db, sql) {
    return new Promise(function(resolve, reject) {
        db.all(sql, function(err, rows) {
            err ? reject(err) : resolve(rows) ;
        })
    })
}

var Bookshelf = require('bookshelf')(knex);
var user = Bookshelf.Model.extend({tableName: 'users'});
var money = Bookshelf.Model.extend({
  tableName:'money', 
//  user : function() { return this.belongsTo(user, 'open_id')}
})

var puzzle = Bookshelf.Model.extend({tableName:"puzzle"}) ;
var test = Bookshelf.Model.extend({
  tableName:'test',
  user : function() { return this.belongsTo(user, 'user_id')}
})
var question = Bookshelf.Model.extend({
    tableName : "question",
    test: function() { return this.belongsTo(test, 'test_id') ; },
    puzzle: function() { return this.belongsTo(puzzle, 'puzzle_id') ; }
}) ;
var conf = Bookshelf.Model.extend({
    tableName: "conf",
})
var msg = Bookshelf.Model.extend({
    tableName: "msg"
})
var statistics = Bookshelf.Model.extend({
  tableName : "statistics"
})
var prize = Bookshelf.Model.extend({
  tableName : "prize"
})

var MONTH_PRIZE_RATIO = [0.5*0.5, 0.5*0.2, 0.5*0.15, 0.5*0.10, 0.5*0.05] ;
var YEAR_PRIZE_RATIO = [0.05*0.5, 0.05*0.2, 0.05*0.15, 0.05*0.10, 0.05*0.05] ;

function ranking_prize(db, start, end, ratio) {
    	console.log('ranking_prize') ;
	return Promise.all([
          profit(db, start, end),
          ranking(db, start, end),
      ])
    .then(function(ret) {
        var money = ret[0][0].money ;
        var ranking = ret[1] ;
	console.log('ranking_prize then') ;
        console.log(ranking) ;

        ranking = ranking.slice(0, ratio.length) ;
        ranking.forEach(function(v, idx) {
            if (idx < ranking.length)
                ranking[idx].money = Math.floor(money * ratio[idx]) ;
        })
        return ranking ;
    }).catch(function(error) {
	console.error(error) ;

	}) 
}


function caculate_pre_month_prize() {
    var start = new Moment().startOf('month').subtract(1, 'days').startOf('month').format('YYYY-MM-DD') ;
    var end = new Moment().startOf('month').subtract(1, 'days').format('YYYY-MM-DD') ;
console.log('calculate pre month') ;
    ranking_prize(db, start, end, MONTH_PRIZE_RATIO).then(function(ranking) {
		console.log('caculate pre month then') ;
              ranking.forEach(function(v, idx) {
                var p =  {
                  date : start.substring(0,7),
                  type : 'month',
                  test_id : v.id,
                  ranking : idx,
                  money : v.money,
                  user_mark : "",
		admin_mark : "",
                } ;       
                new prize().save(p) ;
          })
    })
}

function caculate_pre_year_prize() {
    var start = new Moment().startOf('year').subtract(1, 'days').startOf('year').format('YYYY-MM-DD') ;
    var end = new Moment().startOf('year').subtract(1, 'days').format('YYYY-MM-DD') ;

    ranking_prize(db, start, end, YEAR_PRIZE_RATIO).then(function(ranking) {
          ranking.forEach(function(v, idx) {
            var p = {
                date :  start.substring(0, 4),
                type : 'year',
                test_id : v.id,
                ranking : idx,
                money : v.money,
                mark : "",
            }    
            new prize().save(p) ;
        })
    })
}

// 每个月第一天0点0分0秒
var month_sche = {
    schedules: [
      { day : [1], h : [0], m : [0], s : [0]},
//      {s : [0]}
      ]
  };

// 每年第一个月第一天0点0分0秒
var year_sche = {
    schedules: [
      {M : [1], day : [1], h : [0], m : [0], s : [0]},      
      ]
}

later.date.localTime() ;
//caculate_pre_month_prize() ;
later.setInterval(caculate_pre_month_prize, month_sche) ;
later.setInterval(caculate_pre_year_prize, year_sche) ;


// prize.forge({id : 2}).fetch().then(function(model) {
//     if (model != null) 
//       new prize({id : 2}).save({mark : "测试下"}) ;    
// }) ;


// var order_ret = { 
//     appid:  ['wx26169a090dc52afc'],
//      bank_type: ['CFT'] ,
//      cash_fee: ['1'] ,
//      fee_type: ['CNY'],
//      is_subscribe: ['Y'] ,
//      mch_id:  ['1433643802'] ,
//      nonce_str:  ['uUJIfFDngR4WnjaW'] ,
//      openid:  ['ouBf1vkKoPRHyrCC1MnSE7rpE310'] ,
//      out_trade_no:  ['201702241729321524'] ,
//      result_code:  ['SUCCESS'] ,
//      return_code:  ['SUCCESS'] ,
//      sign:  ['5D93D938A27B999C8B0273E8754DED39'] ,
//      time_end:  ['20170224172942'] ,
//      total_fee:  ['1' ],
//      trade_type:  ['JSAPI'] ,
//      transaction_id:  "111132312312" } ;

//     order_ret.cash_fee = parseInt(order_ret.cash_fee) ;
//     order_ret.total_fee = parseInt(order_ret.total_fee) ;

//     for (var o in order_ret) {
//         order_ret[o] = order_ret[o][0] ;
//     }
//     console.log(order_ret) ;

    // money.forge({transaction_id : order_ret.transaction_id}).fetch().then(function(model) {
    //   if (model == null) {
    //         new money().save(order_ret) ;
    //   }else {
    //         console.log('already have order of : ' + order_ret.transaction_id) ;
    //   }
    // }) ;
     

// 全局配置
var g_conf = {} ;
conf.forge({id:1}).fetch().then(function(model) {        
        g_conf = model.attributes ;
        g_conf.comment = [] ;
        g_conf.short_comment = [] ;
        for(var i=0; i<=10; ++i) {
            var ary = model.attributes['comment' + i].split('\n') ;
            g_conf.short_comment[i] = ary[0] ;
            g_conf.comment[i] = ary.slice(1).join('\n') ;
        }
        //console.log(g_conf) ;
})

function randArray(ary, len) {
    ary.sort(function () {
        return Math.random() - 0.5 ;
    }) ;
    return ary.slice(0, len) ;
}

// 生成订单结构
function build_order(ip, open_id) {   
  //var nonce_str = Math.random().toString(36).substring(2) + Math.random().toString(36).substring(2) ;
  var nonce_str = random_string.generate(16) ;
  var order_id = generate_order_id() ;

    var order_tmpl = {
        appid : APP_ID,
        mch_id : MCH_ID,
        nonce_str : nonce_str,
        sign : "",
        body : g_conf.item_name,
        out_trade_no : order_id,
        total_fee : g_conf.item_price,
        spbill_create_ip : ip,
        notify_url : "http://www.logictest.net/order_notify", // FixMe
        trade_type : "JSAPI",
        openid : open_id,
  } ;

  var param = "" ;

  Object.keys(order_tmpl).sort() .forEach(function(value){
      if (order_tmpl[value] != "")
          param += (value + "=" + order_tmpl[value] + "&") ;
  })

  param += "key=" + MCH_KEY ;
  order_tmpl.sign = md5(param).toUpperCase() ;

  return order_tmpl ;
}

// 生成随机单号
function generate_order_id() {
    var d = new Moment() ;
    var r = '000' + Math.floor(Math.random() * 9999) ;

    return d.format("YYYYMMDDHHmmss") + r.substring(r.length - 4) ;
}

// 生成客户端支付用的签名
function generate_pay_signature(pay_id) {
    //var nonce_str     = Math.random().toString(36).substring(2) + Math.random().toString(36).substring(2) ;
    var nonce_str = random_string.generate(16) ;
    var time_stamp   = '' + Date.parse(new Date()) ;

    var str = "appId=" + APP_ID + "&nonceStr=" + nonce_str + "&package=prepay_id=" + pay_id + 
                      "&signType=" + "MD5" + "&timeStamp=" + time_stamp + "&key=" + MCH_KEY ;
    console.log(str) ;
    var signature = md5(str) ;

    return {
        timestamp : time_stamp,
        nonceStr : nonce_str,
        package : "prepay_id=" + pay_id,
        signType : "MD5",
        paySign : signature,
    }
}

// 生成客户端的wx config
function generate_client_wx_config() {
    //var nonce_str     = Math.random().toString(36).substring(2) + Math.random().toString(36).substring(2) ;
    var nonce_str = random_string.generate(16) ;
    var timestamp   = '' + Date.parse(new Date()) ;

    var str = 'jsapi_ticket=' + APP_TICKET.ticket + '&noncestr=' + nonce_str + '&timestamp=' + timestamp +
                              '&url=' + 'http://www.logictest.net/main.html?stage=cover' ;
    var signature = sha1(str) ;

    return {
      appId : APP_ID,
      timestamp : timestamp,
      nonceStr : nonce_str,
      signature : signature,
    }
}

// for debug
app.post('/*', function(req, res, next) {
   // console.log('post ' + req.url + ' param: ' + JSON.stringify(req.body)) ;
    next() ;
})

// for debug
app.get('/*', function(req, res, next) {
    //console.log(req.connection.remoteAddress + ' get ' + req.url) ;
    next() ;
})

app.get('/', function(req, res, next) {
    // 微信server check
    if (req.query.signature != null && req.query.echostr != null && req.query.timestamp != null && req.query.nonce != null) {
        res.send(req.query.echostr) ;
    }else {
       next() ;
    }
})

app.get('/admin_login.html', function(req, res, next) {
    res.sendFile(__dirname + '/web/admin_login.html') ;
})

app.get('/index.html', function(req, res, next) {
    res.sendFile(__dirname + '/web/index.html') ;
})

app.get('/main.html', function(req, res, netxt) {
    res.sendFile(__dirname + '/web/main.html') ;
})

app.get('/*.html', function(req, res, next) {
    if (req.session.user_id == undefined)
      res.redirect('/admin_login.html') ;
    else
      next() ;
})



// client发过来的第三方登陆
app.get('/mp', function(req, resp, next) {  

    console.log("redirect") ;
    resp.redirect('/#/' + req.query.state + '?code='  + req.query.code) ;
})

// { xml: 
//    { appid: [ 'wx26169a090dc52afc' ],
//      bank_type: [ 'CFT' ],
//      cash_fee: [ '1' ],
//      fee_type: [ 'CNY' ],
//      is_subscribe: [ 'Y' ],
//      mch_id: [ '1433643802' ],
//      nonce_str: [ 'r5eD7AUm0ak8WLG5' ],
//      openid: [ 'ouBf1vkKoPRHyrCC1MnSE7rpE310' ],
//      out_trade_no: [ '201702241332304763' ],
//      result_code: [ 'SUCCESS' ],
//      return_code: [ 'SUCCESS' ],
//      sign: [ '5CAB9ED06F73B0FC8FE1B48ECD7AD506' ],
//      time_end: [ '20170224133237' ],
//      total_fee: [ '1' ],
//      trade_type: [ 'JSAPI' ],
//      transaction_id: [ '4003742001201702241128568311' ] } }

app.post('/order_notify', function(req, resp) {
    console.log(req.body) ;    

    var order_ret = req.body.xml ;

    // 很奇怪，插件转出来的字段值不是字符串，而是字符串的数组
    for (var o in order_ret) {
        order_ret[o] = order_ret[o][0] ;
    }
    console.log(order_ret) ;
    
    order_ret.cash_fee = parseInt(order_ret.cash_fee) ;
    order_ret.total_fee = parseInt(order_ret.total_fee) ;

    money.forge({transaction_id : order_ret.transaction_id}).fetch().then(function(model) {
      if (model == null) {
            new money().save(order_ret) ;
      }else {
            console.log('already have order of : ' + order_ret.transaction_id) ;
      }

      var ret = { return_code : 'SUCCESS', return_msg : 'OK'} ;
      var builder = new xml2js.Builder({headless : true, rootName: "xml"}) ;
      var xml = builder.buildObject(ret) ;

      resp.send(xml)  ;
  })    
})


function profit(db, start, end) {
     var sql = 'select SUM(total_fee) as money from money where date("create_time") >= "' + 
                        start + '" and date(create_time) <=  "' + end  + '"' ;
    console.log('profit sql ' + sql) ;
	return sql_promise(db, sql) ;
}


function last_prize_list(db, t, type) {
    var sql = 'select prize.test_id as prize_test_id, prize.date as prize_date , prize.type as prize_type, prize.test_id as prize_test_id, prize.ranking as prize_ranking, prize.money as prize_money, prize.user_mark as prize_user_mark,  prize.admin_mark as prize_admin_mark, prize.id as prize_id, test.id as test_id, test.start_time as test_start_time, test.score as test_score, test.user_id as test_user_id, test.score_100 as test_score_100, test.test_time as test_test_time, users.id as users_id, users.username as users_username, users.password as users_password, users.point as users_point, users.head_img as users_head_img  from  prize left join test on prize.test_id == test.id left join users  on test.user_id == users.id where prize_type == "' + type + '" and prize_date == "' + t + '"' ;

    return sql_promise(db, sql) ;
}

app.post('/api/admin/prize_mark', function(req, resp) {

   // 此处完全信任客户端发来的序号,
    prize.forge({id : req.body.id}).fetch().then(function(model) {
      if (model != null) {
          new prize({id : req.body.id}).save({admin_mark : req.body.mark}) ;
      }
    }) ;
    
    resp.send({code : 0}) ;
})

app.post('/api/prize_mark', function(req, resp) {

   // 此处完全信任客户端发来的序号,
    prize.forge({id : req.body.id}).fetch().then(function(model) {
      if (model != null) {
          new prize({id : req.body.id}).save({user_mark : req.body.mark}) ;
      }
    }) ;
    
    resp.send({code : 0}) ;
})

app.post('/api/profit_list', function(req, resp) {
      var sql = 'select * from money where date("create_time") >= "' + req.body.start + '" and date(create_time) <=  "' + req.body.end  + '"' ;


      sql_promise(db, sql).then(function(ret) {
          //console.log(ret) ;
          resp.send(ret) ;
      }).catch(err => {
          //console.log(err) ;
      }) ;
})



app.post('/api/last_prize', function(req, resp) {



    var last_month =  new Moment().startOf('month').subtract(1, 'days').startOf('month').format('YYYY-MM') ;
    var last_year = new Moment().startOf('year').subtract(1, 'days').startOf('year').format('YYYY') ;

    Promise.all([
          last_prize_list(db, last_month, 'month'),
          last_prize_list(db, last_year, 'year'),
      ])
    .then(function(ret) {
          //console.log(ret) ;
          resp.send({last_month : ret[0], last_year : ret[1]}) ;
    }).catch( function(err) {
      console.log(err) ;
    });
    
})


app.post('/api/prize_money', function(req, resp) {
    var cur_month_start = new Moment().startOf('month').format('YYYY-MM-DD') ;
    var cur_month_end = new Moment().endOf('month').format('YYYY-MM-DD') ;

    var year_start = new Moment().startOf('year').format('YYYY-MM-DD') ;
    var year_end = Moment().endOf('year').format('YYYY-MM-DD') ;

    Promise.all([
        ranking_prize(db, cur_month_start, cur_month_end, MONTH_PRIZE_RATIO),
        ranking_prize(db, year_start, year_end, YEAR_PRIZE_RATIO)
        ])
    .then(function(ret) {        
        var r = {month_ranking : ret[0], year_ranking : ret[1] } ;
        //console.log(r) ;
        resp.send(JSON.stringify(r)) ;
    }).catch(function(err) {
        console.log(err) ;
    })

})

app.post('/api/login_by_cheat', function(req, resp) {
      // PC端调试用    
      req.session.wx = {
            "openid": "ouBf1vkKoPRHyrCC1MnSE7rpE310",
            "nickname": "阿耀",
            "sex": 1,
            "language": "zh_CN",
            "city": "普陀",
            "province": "上海",
            "country": "中国",
            "headimgurl": "http://wx.qlogo.cn/mmopen/ajNVdqHZLLBymL0gnKbJ7ENFH7PToicjYzibbYyRmjYibWbibb1T1e5pQtXCV5xAOO2ht7x3hhEd5ia8rrTw2tFfIGA/0",
            "privilege": [],
            "token" :   {
                   "access_token": "M06zuM5mx7noGKjIc_FNkfuL1SQq-mdYWJloPF3QFh2276s9LnP6UEIh8XRinzQDZ07JIM0wwMNOvFlYglGhU9RxnkiR3-fzbFtQHU-ayRI",
                   "expires_in": 7200,
                   "refresh_token": "KRdSwE9j69xMja-hoH2q7shY3wn-LjRVlBovD_tD_tgMLwweS5MPxYr_hgViO-ES-Ml71n7cMbmM0uhd_zb8gk_m2N8hC_9VFBWpM4DbchI",
                   "openid": "ouBf1vkKoPRHyrCC1MnSE7rpE310",
                   "scope": "snsapi_userinfo"
            }
      } ;

      //console.log(req.session) ;

      resp.send(JSON.stringify(req.session.wx)) ;
})

app.post('/api/whoami', function(req, resp) {
      resp.send(JSON.stringify( {user : req.session.wx} )) ;
})

app.post('/api/login_by_code', function(req, resp) {
      var url = 'https://api.weixin.qq.com/sns/oauth2/access_token?appid=' + APP_ID + 
                      '&secret=' + APP_SECRET + '&code=' + req.body.code + '&grant_type=authorization_code' ;
      //console.log("try to get token: \n" + url) ;

    // 用code 换 token                      
    request.get(url, function(err, res, token_raw) {
        var token = JSON.parse(token_raw) ;

        var url = 'https://api.weixin.qq.com/sns/userinfo?access_token=' + 
                                  token.access_token + '&openid=' + token.openid + '&lang=zh_CN' ;

       console.log("try to get user info :\n" + url) ;
        // 用token换用户信息
       request.get(url, function(err, res, user_raw) {
            var wx_user = JSON.parse(user_raw) ;
            req.session.wx = wx_user ;
            req.session.wx.config = generate_client_wx_config() ;
            console.log(req.session.wx) ;
                   

            //console.log(new test({id : "ouBf1vnt6r5rMZ0ex1yG5z1YSQNc23423"}).isNew()) ;
              // new user({id : "ouBf1viRjuHukt72QZT6M0f-qFJs", }).save({head_img : "test"}).then(function(model) {
              //                     //resp.send(JSON.stringify(req.session.wx)) ;
              //                     console.log('finished') ;
              // }) ;             
              
            var new_user = {id :  wx_user.openid, username :  wx_user.nickname, password: '', point : 0, head_img : wx_user.headimgurl} ;

            user.forge({id : wx_user.openid}).fetch().then(function(model) {
                if (model == null) {
                    user.forge().save(new_user).then(function(model) {
                          resp.send(JSON.stringify(req.session.wx)) ;
                    })
                }else {
                      new user({id : wx_user.openid}).save({username : wx_user.nickname, head_img : wx_user.headimgurl}).then(function(model) {
                          resp.send(JSON.stringify(req.session.wx)) ;  
                      })                      
                }
            })           

            // var new_user = {id :  wx_user.openid, username :  wx_user.nickname, password: '', point : 0, head_img : wx_user.headimgurl} ;
            // user.forge(new_user).fetch().then(function(model) {
            //     if (model == null) {
            //         user.forge().save(new_user).then(function(model) {
            //               resp.send(JSON.stringify(req.session.wx)) ;
            //         })
            //     }else {
            //           resp.send(JSON.stringify(req.session.wx)) ;
            //     }
            // })

       }) ;
    }) ;
})

app.post('/api/score_share', function(req, res) {

    test.forge({id: req.body.test_id}).fetch({withRelated : ['user']}).then(function(model) {
        
        var info = model.attributes ;
        var n = parseInt((info.score_100 + 9) / 10) ;

        info.comment = g_conf.comment[n] ;
        info.short_comment = g_conf.short_comment[n] ;
        //console.log(JSON.stringify(model)) ;
        info.name = model.relations.user.attributes.username ;

        //console.log(info) ;
        res.send(JSON.stringify(info)) ;
    }) ;
})

app.post('/api/msg_list', function(req, res) {
    msg.forge().orderBy('create_time', 'INC').fetchAll().then(function(model) {
          //如果数据库为空,则models成员会为undefined, fix me
         var r = model.models.map(function(v) { return v.attributes ; })
         res.send(JSON.stringify(r)) ;
        //console.log(r) ;
    })
})

function ranking(db, start, end) {
  // caculate max(score) and min(test_time) as score * 10000 - test_time
  var sql = 'select  test.id as id, test.start_time as start_time, test.score as score, test.user_id as user_id, test.score_100 as score_100, MAX(test.score_100 * 10000 - test.test_time) as score_real, test.test_time as test_time, users.id as openid, users.username as username, users.password as password, users.point as point, users.head_img as head_img  from test left join users on test.user_id = users.id where test.score != -1 and score_100 >= 70 and test.test_time != -1 and date("start_time") >= "' + start + '" and date("start_time") < "' + end + ' "  group by test.user_id  order by score desc, test_time asc limit 1000' ;
  console.log(sql) ;
  // var sql = 'select * from test left join  users on test.user_id = users.id where test.score != -1 and test.test_time != -1 ' +
  //                   'and date("start_time") >= "' + start + '" and date("start_time") < "' + end + '" ' +
  //                  " order by score desc, test_time asc limit 100" ;

   // console.log(sql) ;

   return  sql_promise(db, sql) ;
}

app.post('/api/score_list', function(req, res) {
    var d = new Moment() ;
    var arg = {} ;

    var cur_month_start = new Moment().startOf('month').format('YYYY-MM-DD') ;
    var cur_month_end = new Moment().endOf('month').format('YYYY-MM-DD') ;

    var pre_month_start = new Moment().startOf('month').subtract(1, 'days').startOf('month').format('YYYY-MM-DD') ;
    var pre_month_end = new Moment().startOf('month').subtract(1, 'days').format('YYYY-MM-DD') ;


    var year_start = new Moment().startOf('year').format('YYYY-MM-DD') ;
    var year_end = new Moment().startOf('year').add(1, 'years').format('YYYY-MM-DD') ;

    Promise.all([
                            ranking(db, cur_month_start, cur_month_end),
                            ranking(db, pre_month_start, pre_month_end),
                            ranking(db, year_start, year_end),
                        ]).then(function(ret) {
                              res.send({
                                    cur_month : ret[0],
                                    pre_month : ret[1],
                                    year : ret[2],
                              }) ;
                        }) ;
     
    
})

app.post('/api/build_order', function(req, resp) {
    if (g_conf.item_price == 0) {
        resp.send({need_pay : false}) ; return ;
    }

    var ip = req.connection.remoteAddress ;
    ip = "127.0.0.1" ;
    var order = build_order(ip, req.session.wx.openid) ;

    var builder = new xml2js.Builder({headless : true, rootName: "xml"}) ;
    var xml = builder.buildObject(order) ;
    console.log(xml) ;

    request({url : ORDER_URL, method : 'POST', body : xml}, function(err, res, data) {
          console.log(data) ;
          var parser = new xml2js.Parser() ;
          parser.parseString(data, function (err, result) {
              var r = generate_pay_signature(result.xml.prepay_id) ;
              resp.send({need_pay : true, detail : r}) ;
          }) ;
    })
})

app.post('/api/count', function(req, res) {
    var ip = req.headers['x-forwarded-for'] ? req.headers['x-forwarded-for'] : req.connection.remoteAddress ;
    var obj = {view_type : req.body.type, ip:ip, cookie: "cookie", user_name:"name"} ;
    statistics.forge(obj).save().then(function(model) {
        //console.log(model) ;
        res.send(JSON.stringify({code : 0, type : req.body.type}) ) ;
    }) ;
}) ;

app.post('/api/conf_get', function(req, res) {
    //var user_id = req.session.user_id ;
    //console.log(typeof req.body) ;
    //console.log(req.body) ;

    conf.forge({id:1}).fetch().then(function(c) {        
        //console.log(c.attributes) ;
        res.send(JSON.stringify(c.attributes)) ;
    })
})

app.post('/api/admin/login', function(req, res) {
    if (req.body.username != 'admin') {
        res.send(JSON.stringify({code:1, msg : "account doesn't exist"})) ; return ;
    }

    user.forge({username:req.body.username, password:req.body.password}).fetch().then(function(u) {
      if (!u )
          res.send(JSON.stringify({code:2, msg:"password error"})) ;
      else {
          req.session.user_id = u.attributes.id ;
          req.session.user_name = u.attributes.username ;
          res.send(JSON.stringify({code:0, to: 'admin.html?sub=conf'})) ;          
      }
    })
})

app.post('/api/*', function(req, res, next) {
    //console.log("client" + JSON.stringify(req.session)) ;
    //console.log(req.session) ;
    if (req.session.user_id == undefined && req.session.wx == undefined)
        res.send(JSON.stringify({code:1, msg:"need auth"})) ;
    else
      next() ;
})

app.post('/api/msg_add', function(req, res) {
    var m = {user_name: req.session.wx.nickname, text: req.body.text, user_id: req.session.wx.openid } ;

    msg.forge().save(m).then(function(model) {
         var ret = {code:0, msg: model.attributes, user_name : req.session.wx.nickname} ;
         res.send(JSON.stringify(ret)) ;
     })
})


app.post('/api/point_get', function(req, res) {
    user.forge({id:req.session.wx.openid}).fetch().then(function(u) {
        res.send(JSON.stringify({code:0, point:u.attributes.point})) ;
    })
})

app.post('/api/puzzle_get', function(req, res) {
    puzzle.forge({id: req.body.id}).fetch().then(function(p) {
        if(!p)
            res.send(JSON.stringify({code:1, msg:"can't find puzzle"})) ;
        else
            res.send(JSON.stringify({code:0, puzzle:p})) ;
    })
})

app.post('/api/test_begin', function(req, res) {
    var user_id = req.session.wx.openid ;
    user.forge({id: user_id}).fetch().then(function(u) {
        puzzle.forge().fetchAll().then(function(collection) {
                var puzzle_ary = collection.models.filter(function(v) {
                    return v.enable != 0 ;
                })

                puzzle_ary = randArray(puzzle_ary, g_conf.question_num) ;
            
                test.forge().save({user_id:user_id, score : -1, score_100 : -1, test_time : -1}).then(function(collection) {
                  //console.log(collection.attributes) ;
                  var test_id = collection.attributes.id ;

                  async.forEach(puzzle_ary, function(p, callback) {
                      var puzzle = p.attributes ;
                      var q  = { test_id:test_id, puzzle_id:puzzle.id, answer:'n', score:-1 } ;
                      question.forge().save(q).then(callback) ;
                  }, function(err) {                      
                      res.send(JSON.stringify({code:0, test_id:test_id, puzzle:puzzle_ary})) ;
                  }) ;
             })
          }) ;   
      })                              
  })



app.post('/api/test_finish', function(req, res) {
    var user_id = req.session.wx.openid ;
    var answers = req.body.answers ;
    //req.body.user_name = new Buffer(req.body.user_name, 'base64').toString() ;
    var score = 0 ;
    //console.log('test finish\n' + typeof req.body) ;
    //console.log(req.body) ;

    async.forEach(req.body.answers, function(p, callback) {
        question.forge({test_id: req.body.test_id, puzzle_id:p.id}).fetch({withRelated: ['test', 'puzzle']}).then(function(q) {
                //console.log(q.attributes) ;
                //console.log(q.relations.test.attributes) ;
                //console.log(q.relations.puzzle.attributes) ;

                var update_question = {id:q.id, answer:p.answer} ;
                update_question.score = (p.answer == q.relations.puzzle.attributes.answer ? 1 : 0) ;
                if (update_question.score == 1) score++ ;
                question.forge(update_question).save().then(function(){ callback() ;})
        })             
    }, function(err) {
        console.log('score=' + score) ;
        var score_100 = parseInt(score  * 100 / answers.length) ;        
        
        var t = {id: req.body.test_id, score:score, score_100:score_100, test_time:req.body.test_time} ;

        test.forge(t).save().then(function(t) {
            var n = parseInt((score_100 + 9) / 10) ;
            //if (n == 0) n = 1 ;
            res.send(JSON.stringify({score: score_100, test_time:req.body.test_time, 
                      comment:g_conf.comment[n], short_comment:g_conf.short_comment[n] })) ;
        })
    }) ;
})

app.post('/api/admin/*', function(req, res, next) {
    //console.log(req.session) ;
    if (req.session.user_name != 'admin')
        res.send(JSON.stringify({code:1, msg:"need auth"})) ;
    else
      next() ;
})

app.post('/api/admin/conf_set', function(req, res) {
    // 只有一条记录
    req.body.id = 1 ;
    
    conf.forge(req.body).save().then(function(model) {
      res.send(JSON.stringify({code:0})) ;    

      g_conf = req.body ;
      g_conf.comment = [] ;
      g_conf.short_comment = [] ;
      for(var i=0; i<=10; ++i) {
        var ary = g_conf['comment' + i].split('\n') ;
            g_conf.short_comment[i] = ary[0] ;
            g_conf.comment[i] = ary.slice(1).join('\n') ;
      }
      //console.log(g_conf) ;      
    })
})



app.post('/api/admin/password_change', function(req, res) {
  user.forge({id : 1, username: req.session.user_name, password: req.body.old_password}).fetch().then(function (model) {
      if (!model)
          res.send(JSON.stringify({code:1, msg:"password error"})) ;
      else {
          new user({id : 1}).save({password:req.body.new_password}, {method : "update"}).then(function (model) {
              res.send(JSON.stringify({code:0, msg:"password changed"})) ;
          })
      }
  })
})

app.post('/api/admin/query_stat', function(req, res) {

     var sql  = "select * from statistics where date(\"time\") >= \"" + req.body.from + "\" and date(\"time\") <= \"" + req.body.to + "\"";
     //console.log("query " + sql) ;

     db.all(sql, function(err, rows) {
        res.send(JSON.stringify(rows)) ;
        //console.log(rows) ;
    })
     
}) ;

app.post('/api/admin/puzzle_del', function(req, res) {  

  puzzle.forge({id:req.body.id}).destroy().then(function (model){
      //console.log(model) ;
      res.send(JSON.stringify({code:0})) ;
  })
})

app.post('/api/admin/puzzle_all_get', function(req, res) {

    var begin = req.body.begin ;
    var end = req.body.end ;

    puzzle.forge().fetchAll().then(function (p) {
        var r = p.models.map(function(v) { return v.attributes ; })
        
        async.forEach(r, function(p, callback) {

          db.all('select * from question where puzzle_id == ' + p.id + ' and score != -1', function(err, rows) {
              if (err) console.log(err) ;
             var score = rows.filter(function(e) { return e.score == 1}).length ;
             //if (p.id == 58)
              //console.log('共' + rows.length + ', 答对' + score) ;
             p.tester_num = rows.length ;
             p.right_num = score ;         
             callback() ;                 
          })

        }, function(err) {          
          res.send(JSON.stringify(r)) ; 
        }) ;
    })
})

app.post('/api/admin/cover_upload',function(req,res) {
    upload(req, res, function(err) {
        if(err) {
            return res.send("Error uploading file.") ;
        }

        req.files.forEach(function(file, idx) {
            var cmd = "mv  \"uploads/" + file.filename + "\"  static/img/cover.jpg" ;
            exec(cmd) ;
            console.log("cmd:" + cmd) ;
            res.redirect("/admin.html?sub=conf") ;
        })   
  });
});

app.post('/api/admin/puzzle_set', function(req, res) {

  console.log(req.body) ;
  puzzle.forge(req.body).save().then(function(p) {
      console.log(p) ;
      var ret = {code : 0} ;
      ret.detail = p ;
      res.send(JSON.stringify(ret)) ;
  }) 
})

app.post('/api/admin/logout', function(req, res, next){
    delete req.session.user_id ;
    res.send(JSON.stringify({code:0, to:"login.html"})) ;
})



  var server = app.listen(3000 , function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port) ;

  var url = 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=' + APP_ID + '&secret=' + APP_SECRET ;
  request.get(url, function(err, res, token_raw) {
      APP_TOKEN = JSON.parse(token_raw) ;
      //console.log("APP_TOKEN:\n" + token_raw) ;

       // 用token换ticket
        var url = 'https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=' + 
                                      APP_TOKEN.access_token + '&type=jsapi' ;
        request.get(url, function(err, res, ticket_raw) {
            //console.log(ticket_raw) ;
            APP_TICKET = JSON.parse(ticket_raw) ;
        })
  })

}) ;





