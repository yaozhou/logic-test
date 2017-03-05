CREATE TABLE users (
    "id" TEXT PRIMARY KEY NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "point" INTEGER NOT NULL,
)


-- appid: [ 'wx26169a090dc52afc' ],
--      bank_type: [ 'CFT' ],
--      cash_fee: [ '1' ],
--      fee_type: [ 'CNY' ],
--      is_subscribe: [ 'Y' ],
--      mch_id: [ '1433643802' ],
--      nonce_str: [ 'cFtBX8qM9DArdbsB' ],
--      openid: [ 'ouBf1vkKoPRHyrCC1MnSE7rpE310' ],
--      out_trade_no: [ '201702241717086021' ],
--      result_code: [ 'SUCCESS' ],
--      return_code: [ 'SUCCESS' ],
--      sign: [ '88A00FF9CEE878F746DC6F0E9CA1F842' ],
--      time_end: [ '20170224171718' ],
--      total_fee: [ '1' ],
--      trade_type: [ 'JSAPI' ],
--      transaction_id: [ '4003742001201702241151407094' ] } }

CREATE TABLE prize (
    "id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    "date" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "test_id" TEXT NOT NULL,
    "ranking" INTEGER NOT NULL,
    "money" INTEGER NOT NULL,
    "user_mark" TEXT NOT NULL,
    "admin_mark" TEXT NOT NULL
) ;

CREATE TABLE money (
    "transaction_id" TEXT PRIMARY KEY NOT NULL,
    "out_trade_no" TEXT NOT NULL,
    "openid" TEXT NOT NULL,
    "total_fee" INTEGER NOT NULL,
    "result_code" TEXT NOT NULL,
    "return_code" TEXT NOT NULL,
    "appid" TEXT NOT NULL,
    "bank_type" TEXT NOT NULL,
    "cash_fee" INTEGER NOT NULL,
    "fee_type" TEXT NOT NULL,
    "is_subscribe" TEXT NOT NULL,
    "mch_id" TEXT NOT NULL,
    "nonce_str" TEXT NOT NULL,
    "sign" TEXT NOT NULL,
    "time_end" TEXT NOT NULL,
    "trade_type" TEXT NOT NULL,
    "create_time" DATE DEFAULT (datetime('now', 'localtime'))
) ;


CREATE TABLE puzzle (
        "id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, 
        "question" TEXT NOT NULL, 
        "a" TEXT NOT NULL, 
        "b" TEXT NOT NULL,
        "c" TEXT NOT NULL, 
        "d" TEXT NOT NULL, 
        "answer" TEXT NOT NULL,
        "enable" INTEGER) ;

CREATE TABLE test(
    "id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, 
    "start_time" DATE DEFAULT (datetime('now', 'localtime')), 
    "score" INTEGER NOT NULL, 
    "score_100" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "test_time" INTEGER NOT NULL) ;

CREATE TABLE msg(
        "id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
        "text" TEXT NOT NULL,
        "user_id" INTEGER NOT NULL,
        "user_name" TEXT NOT NULL,
       "create_time" DATE DEFAULT (datetime('now','localtime'))
) ;

CREATE TABLE question(
    "id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, 
    "test_id" INTEGER NOT NULL, 
    "puzzle_id" INTEGER NOT NULL, 
    "answer" TEXT NOT NULL, 
    "score" INTEGER NOT NULL DEFAULT -1) ;

CREATE TABLE conf(
    "id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    "title" TEXT NOT NULL,
    "user_num" TEXT NOT NULL,
    "cover_text" TEXT NOT NULL,
    "test_time" INTEGER NOT NULL,
    "question_num" INTEGER NOT NULL,
    "comment0" TEXT NOT NULL,
    "comment1" TEXT NOT NULL,
    "comment2" TEXT NOT NULL,
    "comment3" TEXT NOT NULL,
    "comment4" TEXT NOT NULL,
    "comment5" TEXT NOT NULL,
"comment6" TEXT NOT NULL,
"comment7" TEXT NOT NULL,
"comment8" TEXT NOT NULL,
"comment9" TEXT NOT NULL,
"comment10" TEXT NOT NULL
) ;

#select * from sqlite_master where type='table';  .table

CREATE TABLE score_comment(
    "id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    "comment" TEXT NOT NULL) ;

CREATE TABLE "users" (
    "id" TEXT PRIMARY KEY  NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "point" INTEGER NOT NULL DEFAULT (0),
    "head_img" TEXT,
) ;

INSERT INTO "users" VALUES(13,'admin','admin',0) ;
INSERT INTO "users" VALUES(1,'yao','yao',567) ;




CREATE TABLE puzzle ("id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, "question" TEXT NOT NULL, "a" TEXT NOT NULL, "b" TEXT NOT NULL, "c" TEXT NOT NULL, "d" TEXT NOT NULL, "answer" TEXT NOT NULL);
INSERT INTO "puzzle" VALUES(1,'“上月本公司展开了一次产品宣传活动。但本月的产品销售量并没有比上个月增加,这说明宣传投入具有很大的盲目性”。以下哪项陈述最有力地加强了上述结论？','我们搞宣传是因为我们的产品积压过多','虽然宣传大战之后在销售总量上没有比上个月增加,但有些品牌还是增加了销售额','正是因为销售总量没有比宣传前增加,所以才有必要做宣传','大多数客户对这种宣传活动并不感兴趣','d');
INSERT INTO "puzzle" VALUES(2,'一个品牌由不知名到知名,并且经久不衰,关键还是要持续保持和增强自己的市场竞争力。名牌是一代创、代代保而形成的,没有名牌要立志创名牌,有了名牌也只能作为竞争的起点。这意味着：','有了一个名牌后即可以在竞争中永远立于不败之地','只要投入大量资金做广告,就可以创立并保持名牌','要树名牌必须不断地炒作','名牌没有"终身制"','d');
INSERT INTO "puzzle" VALUES(3,'“一本小说要畅销,必须有可读性;一本小说,只有深刻触及社会的敏感点,才能有可读性;而一个作者如果不深入生活,他的作品就不可能深刻触及社会的敏感点”。以下哪项不可以从上面的观点中推出？','一个畅销小说作者,不可能不深入生活','一本不触及社会敏感点的小说,不可能畅销','深入生活才有可能写出畅销小说','一个深刻触及社会的敏感点的作者,肯定能写出畅销小说','d');
INSERT INTO "puzzle" VALUES(4,'“全球知名企业的管理者,绝大部分都不是学管理出身的。因此,有人认为管理课程学习对学生们今后做管理工作并没能提供有力的帮助”。以下哪项能够最有力地反驳上述推论？','在管理职位上发展不好的,基本都不是学管理专业的','管理专业毕业生的平均年收入要显著高于同类院校其他专业的毕业生','知名企业在招聘管理人员时,很看重应聘者的所学专业','绝大多数全球知名企业的管理者都承认,他们通过其他途径学习过管理课程','d');
INSERT INTO "puzzle" VALUES(5,'“为了挽救稀有动物穿山甲,有人主张把它们都捕获到动物园进行人工饲养和繁殖”。以下哪项最能否定上述做法？','提出上述观点的是一个动物园主,他的动机带有明显的商业动机','对野生动物的人工饲养受到了动物爱好者的强烈反对','我们应该改善自然环境,让穿山甲在自然中生长','穿山甲的主要食物只存在于自然环境中,在动物园中无法获得足够的这种食物','d');
INSERT INTO "puzzle" VALUES(6,'“消费者并不如厂家所想的那样易受他人或者宣传的影响,他们知道自己需要什么,而他们所想要的也许与其他人认为他们想要的相差甚远”。以下哪项最能反驳上述观点？','大多数人年复一年地购买同一牌子的商品','当人们与同伴一起购物时,通常很少与同伴发生争执','商店的货架上摆着各种牌子的商品,容易使消费者不知所措','同类商品中,做广告最多的公司其销售量总是最大','d');
INSERT INTO "puzzle" VALUES(7,'你觉得下面哪句话逻辑上最合理:','公司财务报销制度的缺陷是审批人太多、报销款到帐太慢而且员工不喜欢','我认为应该提拔小李当经理,因为他工作热情高、能力强并且我认为他很有前途','产品质量差、价格贵、营销方式不对都会造成产品销售不畅','这个公司破产的原因主要是产品不对路、管理混乱而且风水不好','c');
INSERT INTO "puzzle" VALUES(8,'你认为下面哪句话逻辑上最合理:','公司规定员工要按时上班,并且不得迟到早退、更不能旷工','公司规定员工上班时不必穿统一的制服,但着装要干净、得体','公司规定员工不能在上班时打私人电话,要打也要尽量简短','公司希望员工能把自学、培训以及掌握新知识结合起来','b');
INSERT INTO "puzzle" VALUES(9,'“现在很多人都通过网络购物。但网络的虚拟性导致了很多欺诈性事件的发生。所以通过网络购物最大的弊病就是很难真正了解产品和卖家的真实情况”。由这段话可以推论：','通过网络购物肯定会上当','通过网络这条途径不可能了解产品信息','人们应该对网络购物持警惕心理,以免上当','应进一步加强网民的思想道德教育','c');
INSERT INTO "puzzle" VALUES(10,'“面试在求职过程中非常重要。经过面试,如果应聘者的个性不适合待聘工作的要求,则不可能被录用”。以上论断的假设是：','必须经过面试才能取得工作,这是工商界的规矩','个性对工作的影响很大并且面试主持者能够准确地分辨出哪些个性是工作所需要的','面试的唯一目的就是测试应聘者的个性','若一个人的个性适合工作的要求,他就一定被录用','b');
INSERT INTO "puzzle" VALUES(11,'“李文和李武是双胞胎,但李文成绩很好,而李武成绩很差。仔细分析发现,李文和李武成绩差异的原因是李文花在学习上的时间比李武多,而李武却花了更多时间去打球”。以上推论最有可能得出的结论是','李文比李武聪明','在学习上多花时间可以使学习成绩更好。','李文比李武的前途会更好','李武打球肯定比李文打得好','b');
INSERT INTO "puzzle" VALUES(12,'“虽然加班可以增加产量,但许多管理者不再推荐用加班来解决产量上不去的问题。因为加班会导致员工太累而思想不集中,最后会导致产品质量下降”。如果以上论述是正确的,最可能推断出下面哪个结论?','加班可以解决产量上不去的问题。','由于加班会导致员工疲劳,所以它可能导致产品质量下降等更为严重的问题。','加班提高的产量有可能弥补质量下降的不足。','如果给加班者一定的补助,可以让他们更集中思想以提高产品质量','a');
INSERT INTO "puzzle" VALUES(13,'“一个老师是否优秀，取决于他的知识面和表达能力。两者缺一不可。”据此推断，下面哪一句成立的可能性最大：','只有知识面高，表达能力才能高','只有表达能力高，知识面才能高','表达能力高，知识面必然高','表达能力的高低与知识面没有必然联系','d');
INSERT INTO "puzzle" VALUES(14,'你觉得下面哪句话逻辑上最合理：　　','我认为中国的问题有三方面：教育、医疗和学校体制','公司的目标分为长期、短期和内部目标','我们的工作需要销售部、生产部和其他部门协调才能做好','公司利润下降的原因是销售额下降、成本上升以及市场份额下降','c');
INSERT INTO "puzzle" VALUES(15,'你觉得下面哪句话逻辑上最合理：','一个人业绩不好的原因可能是自己不努力、工作方法不对或者工作条件不好','他的成功主要是领导的支持、自己的勤奋，以及每天加班','我喜欢读哲学、历史、经济以及文科类的书籍','我觉得他人品有问题，因为他做事很不细心','a');
INSERT INTO "puzzle" VALUES(16,'你觉得下面哪句话逻辑上最合理：　　','我相信他能把这项工作做好，因为他一向对公司忠诚','我不同意他的说法，因为他上次就说错了','我认为他有能力完成这项任务，因为以前他就多次完成过类似的任务','我同意他的方案，因为他是一个值得尊敬、可信赖的人','c');
INSERT INTO "puzzle" VALUES(17,'你觉得下面哪句话逻辑上最合理：','我觉得他的方案最节省，因为他是一个很节俭的人','她的做法肯定是对的，因为她一直为公司着想','我反对他的方案，因为他的工作态度一点也不端正','他适合这个职务，因为他有这方面的知识、经验和能力','d');
INSERT INTO "puzzle" VALUES(18,'由于材料价格上涨，导致成本增加，许多企业的利润都下降了。虽然材料成本占本公司的成本比例不大，但物价上涨也给本公司带来了很大的负面影响。这是因为：','物价上涨已经引起了本公司的严重关注','物价上涨让员工生活负担加重因而要求提高工资，这就增加了企业的成本','本企业应该考虑提高产品价格来对付物价上涨','物价上涨会让许多企业搬到物价低的国家','b');
INSERT INTO "puzzle" VALUES(19,' “某研究通过测量百岁老人的身高发现他们太多数都身材矮小，于是得出结论：矮个子比高个子平均寿命要长”。这个结论的成立需要下面哪一个假设也成立？','身材不受营养因素影响','身高不会随年龄增长而萎缩','身材太高的人往往容易跌倒，所以寿命受到影响','身材矮小的人对食物依赖小，所以更长寿','b');
INSERT INTO "puzzle" VALUES(20,'“未引进优秀的人才并不是该公司利润下降的唯一原因。还有一个原因是：公司的体制不利于人才开展工作”。由以上论断不能推出的结论是：','公司体制是未能引进优秀人才的主要原因','许多在岗的员工，都因公司体制不好而不能正常施展才华','公司的体制不好与未引进优秀的人才都是该公司利润下降的重要原因','有人把公司体制的改进视为提高公司利润的关键','a');
INSERT INTO "puzzle" VALUES(21,'“研究发现，肺癌患者中，吸烟者的比率比人普通人群中吸烟比率高3倍。这说明吸烟的人更容易得肺癌”。以上推理的成立，必须排除下面一个因素：','肺癌患者更喜欢吸烟','香烟中的尼古丁是致癌物','被动吸烟者也容易得肺癌','女性吸烟者少所以她们患肺癌比率低','a');
INSERT INTO "puzzle" VALUES(22,' 你觉得下面哪句话逻辑上最合理：','他在文科、理科与英语方面都很优秀','小刘准备先去美国，再去英国，最后去伦敦玩几天','公司利润下降的原因是销售额下降、成本上升以及产品卖不出去','我们的工作需要销售部、生产部和其他部门协调才能做好','d');
INSERT INTO "puzzle" VALUES(23,' 你觉得下面哪句话逻辑上最合理：','他在文科、理科与英语方面都很优秀','小刘准备先去美国，再去英国，最后去伦敦玩几天','公司利润下降的原因是销售额下降、成本上升以及产品卖不出去','我们的工作需要销售部、生产部和其他部门协调才能做好','d');
INSERT INTO "puzzle" VALUES(24,'你觉得下面哪句话逻辑上最合理：','成长的环境包括家庭、学校和工作单位等','她学习成绩好主要是因为学习方法正确并且懂得如何学习','他在人品方面是我们学习的好榜样，因为他成绩突出','他总是和我作对，所以，他的话肯定是错的','a');
INSERT INTO "puzzle" VALUES(25,'你觉得下面哪句话逻辑上最合理：','我认为他的话有道理，因为他从不撒谎','我认为他最有可能通过这次考试，因为他的成绩一直名列前茅','他绝对会出错，因为他已经错了三次','我认为他的方案最好，因为他一直为公司利益着想','b');
INSERT INTO "puzzle" VALUES(26,'你觉得下面哪句话逻辑上最合理：','他的超强能力和丰富经验有助于他承担这项新工作','小李比小王更胜任这个职位，因为小李是双子座而小王不是','这个月产品质量下降了，一定是生产者不认真造成的','今年销量增加了，一定是我们的产品质量提高了','a');
INSERT INTO "puzzle" VALUES(27,'“有人发现，活到100岁去世的人比只活到70岁去世的人耳朵要长，因此认为可以从耳朵和长短来预测一个人的寿命长短”。这个结论的成立需要下面哪一个假设也成立？','耳朵长短不受营养因素影响','耳朵长短不受性别因素影响','耳朵不会一直随年龄增长而不停地增长','耳朵短的人不爱运动，所以寿命比较短','c');
INSERT INTO "puzzle" VALUES(28,'“李经理不是公司失败的唯一原因。还有一个原因是：董事长没有给李经理足够的支持”。由以上论断可以推出的结论是：','董事长是公司失败的主要原因','李经理不懂得如何与董事长搞好关系','董事长不相信李经理，所以不敢放权给他','公司失败可能与董事长和李经理都有关','d');
INSERT INTO "puzzle" VALUES(29,'“他最近加强了英语单词的记忆，但英语成绩并没有提升，其它成绩也没有提升”。最有可能的原因是：','他太偏科了，不能只注意英语而应该全面发展','他在英语上的问题很有可能是语法太差而不是单词不够','他早就应该多记单词了','他的问题是考试发挥不好','b');
INSERT INTO "puzzle" VALUES(30,'“他最近加强了英语单词的记忆，但英语成绩并没有提升，其它成绩也没有提升”。最有可能的原因是：','他太偏科了，不能只注意英语而应该全面发展','他在英语上的问题很有可能是语法太差而不是单词不够','他早就应该多记单词了','他的问题是考试发挥不好','b');
INSERT INTO "puzzle" VALUES(31,'小刘虽然在员工中年龄最小、学历最低、工龄最短，但他从来没有停止过学习并不断改进工作方法，所以他在公司的业绩超越了其他人，取得了领先地位。这意味着：','成功不是由学历和资历决定的','只要学习就能成功','在竞争中一定要抓住机会','年龄小、学历低、工龄短是成功的条件','a');
INSERT INTO "puzzle" VALUES(32,'“要提高销量，一定要把好产品质量关；产品的质量与生产流程的控制是密不可分的；生产流程的控制离不开生产人员的严格培训”。以下哪项可以从上面的观点中推出? ','培训好了生产人员，就一定能打开销路','产品质量不高肯定是因为生产流程没有控制好','销量上升的原因不外乎生产流程的控制与生产人员的培训','产品质量将影响产品销量','d');
INSERT INTO "puzzle" VALUES(33,'“企业是否成功有内因与外因两个因素。两者缺一不可。内因有产品质量、产品成本、销售网络等；外因包括经济形势、竞争对手实力等。”据此推断，下面哪一句成立的可能性最大：','企业要成功，内因比外因更重要','内因与外因并没有必然联系','外因好，内因才能好','如果运气好，没有内因和外因也能成功','b');
INSERT INTO "puzzle" VALUES(34,'“为了提高长跑运动员的成绩，有人主张让他们每天多吃鸡蛋以增加蛋白质。因为蛋白质能让肌肉变粗因而让肌肉更有爆发力”。以下哪项最能否定上述做法？','那是养鸡农场主提出的观点，明显是为了多卖鸡蛋','历史上好的长跑运动员并没有多吃鸡蛋的习惯','长跑运动员的成绩并不取决于肌肉的爆发力，而是耐力','长跑运动员更需要多吃维生素，光有蛋白质是不够的','c');
INSERT INTO "puzzle" VALUES(35,'“我认为电视广告并不能提高我们的产品知名度和扩大销量。很多人都讨厌电视广告，所以也就讨厌电视广告中推广的产品。结果，他们会买没有电视广告的产品”。以下哪项最能反驳上述观点？','同类商品中，做电视广告最多的销售量总是最大','许多人选择产品时常常是根据朋友的推荐','很多人根本不看电视','并不是所有人都讨厌电视广告','a');
INSERT INTO "puzzle" VALUES(36,'你觉得下面哪句话逻辑上最合理： ','他的问题是工作不努力、粗心大意并且常常出错','我认为武汉比长沙更适合居住，因为我特别喜欢武汉','员工离职的原因可能来自员工自身的发展需求，也可能来自公司的问题','他们关系不好的原因是两个人的星座正好相克','c');
INSERT INTO "puzzle" VALUES(37,'下面是一个公司的规定，你觉得哪句话逻辑上最严谨：','如果身体不舒服，可以请病假，但最好要有病假条','上班不能迟到，除非提前得到领导批准','工作时必须着统一的制服，或者要穿得干净、得体','个人费用报销必须提供有公章的、有日期的发票或者收据','b');
INSERT INTO "puzzle" VALUES(38,'“现在很多人都通过网络寻找婚姻配偶。但网络的虚拟性导致了很多欺诈性事件的发生。因为通过网络择偶最大的弊病就是很难真正了解双方的真实情况”。由这段话可以推论：','人们的诚信度越来越低了','通过网络这条途径不可能寻找到美满的婚姻','通过网络择偶是有风险的','通过网络择偶虽然有风险，但也值得一试','c');
INSERT INTO "puzzle" VALUES(39,'  “性格类型测试在录取新员工的过程中非常重要。经过测试，如果应聘者的性格类型不适合待聘工作的要求，则不可能被录用”。以上论断的假设是：','性格类型对工作的影响很大并且能够通过测试准确地检测出性格类型','检测性格类型是招聘中最重要的工作','性格类型好的人就能找到好的工作','检测性格类型虽然重要但难度非常大','a');
INSERT INTO "puzzle" VALUES(40,'“刘文和李武是同时进公司的大学毕业生，在相同的岗位上工作。但刘文的业绩明显好于李武。仔细分析发现他们的差别是：刘文在工作上的改进比李武多，但李武比刘文工作更努力”。以上分析最有可能得出的结论是：','公司并不需要员工努力工作','刘文比李武聪明','改进工作比努力工作更有利于提高业绩','刘文比李武更有前途','c');
INSERT INTO "puzzle" VALUES(41,'“虽然引入ABC管理模式可以提高产品质量，但许多管理者不再推荐使用它。因为此模式需要耗费大量的资金，最后会导致产品成本上升”。如果以上论述是正确的，最不可能推断出下面哪个结论：','虽然ABC管理模式能提高产品质量，但它对成本的负面影响太大所以没有推广价值','ABC管理模式提高的产品质量可以弥补成本上升的不足','如果能降低ABC管理模式的实施费用，它还是有可能为公司带来利益','产品成本比产品质量更重要','b');
INSERT INTO "puzzle" VALUES(42,' “由于最近新进员工的培训不够，导致他们操作不熟练，生产效率降低，结果产品的生产周期延长。最后客户拒绝订我们公司的产品而选择竞争对手的产品，因为竞争对手的产品到货更快”。以上分析最有可能得出的结论是：','我们的员工培训远远不及竞争对手做得好','培训问题已经引起了本公司的严重关注','产品生产速度比产品的质量重要','产品生产周期已经对产品销量产生了影响','d');
INSERT INTO "puzzle" VALUES(43,' “某研究发现，学习成绩越差的学生中，网瘾青少年的比例越高。所以据此推论：网瘾是学习成绩差的原因”。下列哪一条能反驳上述推论？','网瘾让青少年常常缺课，所以成绩差','成绩差的青少年年更容易得网瘾','上网可以提高青少年的知识面','上网打游戏可以提高学生的反应速度','b');



CREATE TABLE test(
            "id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, 
            "start_time" DATE DEFAULT (datetime('now', 'localtime')), 
            "score" INTEGER NOT NULL DEFAULT -1,  
            "user_id" INTEGER NOT NULL, 
            "score_100" INTEGER, 
            "test_time" INTEGER) ;

CREATE TABLE question(
            "id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, 
            "test_id" INTEGER NOT NULL, 
            "puzzle_id" INTEGER NOT NULL, 
            "answer" TEXT NOT NULL, 
            "score" INTEGER NOT NULL DEFAULT -1) ;


CREATE TABLE conf(
    "id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    "title" TEXT NOT NULL,
    "user_num" TEXT NOT NULL,
    "cover_text" TEXT NOT NULL,
    "item_name" TEXT NOT NULL,
    "item_price" INTEGER NOT NULL,
    "comment0" TEXT NOT NULL,
    "comment1" TEXT NOT NULL,
    "comment2" TEXT NOT NULL,
    "comment3" TEXT NOT NULL,
    "comment4" TEXT NOT NULL,
    "comment5" TEXT NOT NULL,
"comment6" TEXT NOT NULL,
"comment7" TEXT NOT NULL,
"comment8" TEXT NOT NULL,
"comment9" TEXT NOT NULL,
"question_num" INTEGER NOT NULL,
"test_time" INTEGER NOT NULL) ;

INSERT INTO "conf" VALUES(1,'微信逻辑测试','9999+','逻辑是思维与沟通的最重要技能。通过回答十道精心设计、严格检验的多选题，您可以了解自己的逻辑水平。本测试需要在15分钟内完成，不能中断。时间截止时，不论您是否完成所有题目，测试都将终止并进入评分页面.您完成全部问题的时间将被记录并在报告中显示。如果您全部答对。那么用时最短者将有机会争夺全球排名并获得奖金。 您准备好了吗？', '情智测试', 1, '简短的评论
0<=10的','简短的<20的评论
10<=20','简短的<30的评论
20<=30','简短的<40的评论
30<=40的评论','简短的<50的评论
40<=50','简短的<60的评论
50<=60','简短的<70的评论
你的分数是60-70','简短的<80的评论
70<=80','简短的<90的评论
80<=90','简短的<100的评论
你太有才了.',5,150) ;



CREATE TABLE "statistics"(
        "id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
        "view_type" TEXT NOT NULL,
        "ip" INTEGER NOT NULL,
        "cookie" TEXT NOT NULL,
        "user_name" TEXT NOT NULL,
       "time" DATE DEFAULT (datetime('now','localtime'))
) ;
