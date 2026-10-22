/* 语法数据：JLPT 路线图 · 助词课 · 动词活用
 * 所有日语例句均为原创。ruby 去掉标签后与 jp 字段完全一致。
 */
window.GRAMMAR = {
  /* ---------- 1. JLPT 语法路线图 ---------- */
  roadmap: [
    {
      level: "N5",
      summary: "打基础：礼貌体句型、基本助词与动词ます形",
      points: [
        { pattern: "〜は〜です", meaning: "……是……" },
        { pattern: "〜ます／〜ません", meaning: "礼貌体肯定／否定" },
        { pattern: "〜ました", meaning: "礼貌体过去式" },
        { pattern: "〜があります／います", meaning: "有……／在……" },
        { pattern: "〜たい", meaning: "想做……" },
        { pattern: "〜てください", meaning: "请（做）……" },
        { pattern: "〜ましょう", meaning: "一起……吧" },
        { pattern: "〜てもいいです", meaning: "可以……" },
        { pattern: "〜てはいけません", meaning: "不可以……" },
        { pattern: "AよりBのほうが〜", meaning: "B比A更……" }
      ]
    },
    {
      level: "N4",
      summary: "进阶：て形应用、条件句、可能·被动·使役",
      points: [
        { pattern: "〜たことがある", meaning: "曾经……过" },
        { pattern: "〜ている", meaning: "正在……／状态持续" },
        { pattern: "〜ながら", meaning: "一边……一边……" },
        { pattern: "〜たら", meaning: "如果……／……之后" },
        { pattern: "〜ば", meaning: "假如……就……" },
        { pattern: "〜そうだ（样态）", meaning: "看起来好像……" },
        { pattern: "〜てしまう", meaning: "……完了／不小心……" },
        { pattern: "〜（よ）うと思う", meaning: "打算……" },
        { pattern: "〜られる（被动）", meaning: "被……" },
        { pattern: "〜させる（使役）", meaning: "让／使……做" }
      ]
    },
    {
      level: "N3",
      summary: "过渡：表达意图、推测、原因与时间关系",
      points: [
        { pattern: "〜ようにする", meaning: "尽量做到……" },
        { pattern: "〜ことにする", meaning: "决定……" },
        { pattern: "〜はずだ", meaning: "按理说应该……" },
        { pattern: "〜わけだ", meaning: "难怪……／当然……" },
        { pattern: "〜ばかり", meaning: "光是……／净是……" },
        { pattern: "〜うちに", meaning: "趁……时" },
        { pattern: "〜おかげで", meaning: "多亏了……" },
        { pattern: "〜せいで", meaning: "都怪……" },
        { pattern: "〜によって", meaning: "根据／由于／因……而异" },
        { pattern: "〜ところだ", meaning: "正要／正在／刚刚……" }
      ]
    },
    {
      level: "N2",
      summary: "中高级：书面语气、逻辑转折与说话人判断",
      points: [
        { pattern: "〜にもかかわらず", meaning: "尽管……却……" },
        { pattern: "〜わけにはいかない", meaning: "不能……（情理上）" },
        { pattern: "〜ざるを得ない", meaning: "不得不……" },
        { pattern: "〜に違いない", meaning: "一定是……" },
        { pattern: "〜ものの", meaning: "虽然……但是……" },
        { pattern: "〜に応じて", meaning: "根据……相应地" },
        { pattern: "〜一方だ", meaning: "越来越……" },
        { pattern: "〜たとたん（に）", meaning: "刚一……就……" },
        { pattern: "〜をきっかけに", meaning: "以……为契机" },
        { pattern: "〜ことから", meaning: "由于……（据此判断）" }
      ]
    },
    {
      level: "N1",
      summary: "高级：正式书面语、文学性表达与微妙语感",
      points: [
        { pattern: "〜をもって", meaning: "以……（手段／时间）" },
        { pattern: "〜ともなると", meaning: "一旦到了……" },
        { pattern: "〜んばかりに", meaning: "几乎要……似的" },
        { pattern: "〜ずにはおかない", meaning: "必然会……" },
        { pattern: "〜をよそに", meaning: "不顾……" },
        { pattern: "〜まじき", meaning: "不应有的……" },
        { pattern: "〜といえども", meaning: "即使……也……" },
        { pattern: "〜ならでは", meaning: "只有……才有的" },
        { pattern: "〜にかこつけて", meaning: "以……为借口" },
        { pattern: "〜が早いか", meaning: "刚一……就立刻……" }
      ]
    }
  ],

  /* ---------- 2. 助词课 ---------- */
  particles: [
    {
      p: "は",
      title: "主题提示「は」",
      read: "wa",
      core: "「は」提示句子的主题，相当于“说到……”，后面是对它的说明；也可用于对比。作助词时写作「は」，读作 wa。",
      uses: [
        { use: "提示主题", jp: "兄は料理人です。", ruby: "<ruby>兄<rt>あに</rt></ruby>は<ruby>料理人<rt>りょうりにん</rt></ruby>です。", zh: "我哥哥是厨师。" },
        { use: "表示对比", jp: "肉は食べますが、魚は食べません。", ruby: "<ruby>肉<rt>にく</rt></ruby>は<ruby>食<rt>た</rt></ruby>べますが、<ruby>魚<rt>さかな</rt></ruby>は<ruby>食<rt>た</rt></ruby>べません。", zh: "肉我吃，但鱼我不吃。" },
        { use: "以时间为话题", jp: "日曜日は図書館に行きます。", ruby: "<ruby>日曜日<rt>にちようび</rt></ruby>は<ruby>図書館<rt>としょかん</rt></ruby>に<ruby>行<rt>い</rt></ruby>きます。", zh: "星期天（我）去图书馆。" }
      ],
      pitfall: "「は」和「が」最容易混。疑问词作主语时只能用「が」：说「誰が来ましたか」，不能说「誰は来ましたか」。简单记：已知的话题用「は」，新信息或要强调“是谁/是什么”时用「が」。",
      quiz: [
        { q: "「お名前は？」「わたし（　）陳です。」", ruby: "「お<ruby>名前<rt>なまえ</rt></ruby>は？」「わたし（　）<ruby>陳<rt>ちん</rt></ruby>です。」", options: ["は", "が", "を", "に"], answer: "は", why: "以“我”为话题进行自我介绍，用「は」。" },
        { q: "コーヒーは飲みますが、お茶（　）飲みません。", ruby: "コーヒーは<ruby>飲<rt>の</rt></ruby>みますが、お<ruby>茶<rt>ちゃ</rt></ruby>（　）<ruby>飲<rt>の</rt></ruby>みません。", options: ["は", "が", "の", "で"], answer: "は", why: "前后两项形成对比（咖啡喝、茶不喝），用「は」。" },
        { q: "誰（　）この絵をかきましたか。", ruby: "<ruby>誰<rt>だれ</rt></ruby>（　）この<ruby>絵<rt>え</rt></ruby>をかきましたか。", options: ["は", "が", "を", "に"], answer: "が", why: "疑问词「誰」作主语时必须用「が」，不能用「は」。" }
      ]
    },
    {
      p: "が",
      title: "主语标记「が」",
      read: "ga",
      core: "「が」标记主语，常用来引出新信息或疑问词主语；「好き・上手・わかる」等的对象、「ある・いる」的存在主体也用「が」。",
      uses: [
        { use: "存在句中的事物", jp: "公園に大きな犬がいます。", ruby: "<ruby>公園<rt>こうえん</rt></ruby>に<ruby>大<rt>おお</rt></ruby>きな<ruby>犬<rt>いぬ</rt></ruby>がいます。", zh: "公园里有一只大狗。" },
        { use: "喜好的对象", jp: "妹は甘いものが好きです。", ruby: "<ruby>妹<rt>いもうと</rt></ruby>は<ruby>甘<rt>あま</rt></ruby>いものが<ruby>好<rt>す</rt></ruby>きです。", zh: "我妹妹喜欢甜食。" },
        { use: "疑问词作主语", jp: "どれがあなたのかばんですか。", ruby: "どれがあなたのかばんですか。", zh: "哪个是你的包？" }
      ],
      pitfall: "中文说“我喜欢猫”，学习者常直译成「猫を好きです」。规范说法是「猫が好きです」。「好き・嫌い・上手・下手・わかる・できる」的对象都用「が」。",
      quiz: [
        { q: "机の上にペン（　）あります。", ruby: "<ruby>机<rt>つくえ</rt></ruby>の<ruby>上<rt>うえ</rt></ruby>にペン（　）あります。", options: ["が", "を", "で", "へ"], answer: "が", why: "存在句「〜に〜があります」中，存在的东西用「が」。" },
        { q: "私はテニス（　）上手じゃありません。", ruby: "<ruby>私<rt>わたし</rt></ruby>はテニス（　）<ruby>上手<rt>じょうず</rt></ruby>じゃありません。", options: ["が", "を", "で", "と"], answer: "が", why: "「上手」的对象用「が」。" },
        { q: "中国語（　）少しわかります。", ruby: "<ruby>中国語<rt>ちゅうごくご</rt></ruby>（　）<ruby>少<rt>すこ</rt></ruby>しわかります。", options: ["が", "を", "で", "に"], answer: "が", why: "「わかる」的对象用「が」，不用「を」。" }
      ]
    },
    {
      p: "を",
      title: "宾语标记「を」",
      read: "o",
      core: "「を」标记他动词的直接宾语；也可表示移动时经过或离开的场所。写作「を」，读作 o。",
      uses: [
        { use: "动作的对象", jp: "毎朝パンを食べます。", ruby: "<ruby>毎朝<rt>まいあさ</rt></ruby>パンを<ruby>食<rt>た</rt></ruby>べます。", zh: "每天早上吃面包。" },
        { use: "经过的场所", jp: "川沿いの道を散歩しました。", ruby: "<ruby>川沿<rt>かわぞ</rt></ruby>いの<ruby>道<rt>みち</rt></ruby>を<ruby>散歩<rt>さんぽ</rt></ruby>しました。", zh: "沿着河边的路散了步。" },
        { use: "离开的场所", jp: "八時に家を出ます。", ruby: "<ruby>八時<rt>はちじ</rt></ruby>に<ruby>家<rt>いえ</rt></ruby>を<ruby>出<rt>で</rt></ruby>ます。", zh: "八点出门（离开家）。" }
      ],
      pitfall: "中文“坐公交车”“见朋友”看起来都有宾语，但日语要用「に」：「バスに乗ります」「友達に会います」。说成「バスを乗ります」「友達を会います」是典型错误。",
      quiz: [
        { q: "駅で切符（　）買いました。", ruby: "<ruby>駅<rt>えき</rt></ruby>で<ruby>切符<rt>きっぷ</rt></ruby>（　）<ruby>買<rt>か</rt></ruby>いました。", options: ["を", "が", "に", "で"], answer: "を", why: "「買う」是他动词，买的东西用「を」。" },
        { q: "毎日この橋（　）渡ります。", ruby: "<ruby>毎日<rt>まいにち</rt></ruby>この<ruby>橋<rt>はし</rt></ruby>（　）<ruby>渡<rt>わた</rt></ruby>ります。", options: ["を", "に", "で", "が"], answer: "を", why: "过桥时“经过”的场所用「を」。" },
        { q: "電車（　）乗って、会社へ行きます。", ruby: "<ruby>電車<rt>でんしゃ</rt></ruby>（　）<ruby>乗<rt>の</rt></ruby>って、<ruby>会社<rt>かいしゃ</rt></ruby>へ<ruby>行<rt>い</rt></ruby>きます。", options: ["を", "に", "で", "が"], answer: "に", why: "乘坐交通工具用「〜に乗る」，不用「を」。" }
      ]
    },
    {
      p: "に",
      title: "时间·地点·对象「に」",
      read: "ni",
      core: "「に」表示动作发生的具体时间点、人或物存在的场所、移动的目的地，以及动作的对象（给谁、见谁）。",
      uses: [
        { use: "具体时间点", jp: "毎晩十一時に寝ます。", ruby: "<ruby>毎晩<rt>まいばん</rt></ruby><ruby>十一時<rt>じゅういちじ</rt></ruby>に<ruby>寝<rt>ね</rt></ruby>ます。", zh: "每天晚上十一点睡觉。" },
        { use: "存在的场所", jp: "猫はソファの下にいます。", ruby: "<ruby>猫<rt>ねこ</rt></ruby>はソファの<ruby>下<rt>した</rt></ruby>にいます。", zh: "猫在沙发下面。" },
        { use: "动作的对象", jp: "母に手紙を書きました。", ruby: "<ruby>母<rt>はは</rt></ruby>に<ruby>手紙<rt>てがみ</rt></ruby>を<ruby>書<rt>か</rt></ruby>きました。", zh: "给妈妈写了一封信。" }
      ],
      pitfall: "中文的“在”既可能是「に」也可能是「で」。表示存在（いる・ある・住む）用「に」，表示在某处做动作用「で」：「図書館で勉強します」，不说「図書館に勉強します」。另外「今日・明日・毎日」等相对时间后面不加「に」。",
      quiz: [
        { q: "来週の土曜日（　）友達と映画を見ます。", ruby: "<ruby>来週<rt>らいしゅう</rt></ruby>の<ruby>土曜日<rt>どようび</rt></ruby>（　）<ruby>友達<rt>ともだち</rt></ruby>と<ruby>映画<rt>えいが</rt></ruby>を<ruby>見<rt>み</rt></ruby>ます。", options: ["に", "で", "を", "が"], answer: "に", why: "具体的日期、星期等时间点后用「に」。" },
        { q: "祖母は田舎（　）住んでいます。", ruby: "<ruby>祖母<rt>そぼ</rt></ruby>は<ruby>田舎<rt>いなか</rt></ruby>（　）<ruby>住<rt>す</rt></ruby>んでいます。", options: ["に", "で", "を", "へ"], answer: "に", why: "「住む」表示居住（存在）的场所，用「に」。" },
        { q: "駅の前で先生（　）会いました。", ruby: "<ruby>駅<rt>えき</rt></ruby>の<ruby>前<rt>まえ</rt></ruby>で<ruby>先生<rt>せんせい</rt></ruby>（　）<ruby>会<rt>あ</rt></ruby>いました。", options: ["に", "を", "で", "が"], answer: "に", why: "「会う」的对象用「に」（也可用「と」），不用「を」。" }
      ]
    },
    {
      p: "で",
      title: "场所·手段「で」",
      read: "de",
      core: "「で」表示动作进行的场所，也可表示手段、工具、材料，以及比较的范围。",
      uses: [
        { use: "动作进行的场所", jp: "近所のカフェで本を読みます。", ruby: "<ruby>近所<rt>きんじょ</rt></ruby>のカフェで<ruby>本<rt>ほん</rt></ruby>を<ruby>読<rt>よ</rt></ruby>みます。", zh: "在附近的咖啡馆看书。" },
        { use: "手段·交通方式", jp: "自転車で学校へ行きます。", ruby: "<ruby>自転車<rt>じてんしゃ</rt></ruby>で<ruby>学校<rt>がっこう</rt></ruby>へ<ruby>行<rt>い</rt></ruby>きます。", zh: "骑自行车去学校。" },
        { use: "范围", jp: "クラスで一番背が高いのは田中さんです。", ruby: "クラスで<ruby>一番<rt>いちばん</rt></ruby><ruby>背<rt>せ</rt></ruby>が<ruby>高<rt>たか</rt></ruby>いのは<ruby>田中<rt>たなか</rt></ruby>さんです。", zh: "班上个子最高的是田中。" }
      ],
      pitfall: "关键看动词：有具体动作（吃、学习、工作、玩）用「で」，只表示“在那里”用「に」。「部屋でいます」是错的，应说「部屋にいます」。",
      quiz: [
        { q: "毎週末、公園（　）テニスをします。", ruby: "<ruby>毎週末<rt>まいしゅうまつ</rt></ruby>、<ruby>公園<rt>こうえん</rt></ruby>（　）テニスをします。", options: ["で", "に", "を", "へ"], answer: "で", why: "打网球是动作，动作进行的场所用「で」。" },
        { q: "メール（　）連絡してください。", ruby: "メール（　）<ruby>連絡<rt>れんらく</rt></ruby>してください。", options: ["で", "を", "に", "が"], answer: "で", why: "联系的手段（通过邮件）用「で」。" },
        { q: "このケーキは卵と牛乳（　）作ります。", ruby: "このケーキは<ruby>卵<rt>たまご</rt></ruby>と<ruby>牛乳<rt>ぎゅうにゅう</rt></ruby>（　）<ruby>作<rt>つく</rt></ruby>ります。", options: ["で", "を", "に", "が"], answer: "で", why: "制作所用的材料用「で」。" }
      ]
    },
    {
      p: "へ",
      title: "方向「へ」",
      read: "e",
      core: "「へ」表示移动的方向或目的地，作助词时写作「へ」，读作 e；表示目的地时多数情况可与「に」互换。",
      uses: [
        { use: "移动的方向", jp: "夏休みに北海道へ行きます。", ruby: "<ruby>夏休<rt>なつやす</rt></ruby>みに<ruby>北海道<rt>ほっかいどう</rt></ruby>へ<ruby>行<rt>い</rt></ruby>きます。", zh: "暑假去北海道。" },
        { use: "「〜への」修饰名词", jp: "家族への手紙を書いています。", ruby: "<ruby>家族<rt>かぞく</rt></ruby>への<ruby>手紙<rt>てがみ</rt></ruby>を<ruby>書<rt>か</rt></ruby>いています。", zh: "正在写给家人的信。" }
      ],
      pitfall: "「へ」只用于移动的方向，不能表示时间或存在场所：「七時へ起きます」「部屋へいます」都是错的。另外作助词时读 e，不读 he。",
      quiz: [
        { q: "来月、両親と京都（　）旅行に行きます。", ruby: "<ruby>来月<rt>らいげつ</rt></ruby>、<ruby>両親<rt>りょうしん</rt></ruby>と<ruby>京都<rt>きょうと</rt></ruby>（　）<ruby>旅行<rt>りょこう</rt></ruby>に<ruby>行<rt>い</rt></ruby>きます。", options: ["へ", "を", "で", "が"], answer: "へ", why: "移动的目的地用「へ」（也可用「に」）。" },
        { q: "毎朝七時（　）起きます。", ruby: "<ruby>毎朝<rt>まいあさ</rt></ruby><ruby>七時<rt>しちじ</rt></ruby>（　）<ruby>起<rt>お</rt></ruby>きます。", options: ["へ", "に", "で", "を"], answer: "に", why: "具体时间点用「に」，「へ」不能表示时间。" },
        { q: "東の方（　）まっすぐ歩いてください。", ruby: "<ruby>東<rt>ひがし</rt></ruby>の<ruby>方<rt>ほう</rt></ruby>（　）まっすぐ<ruby>歩<rt>ある</rt></ruby>いてください。", options: ["へ", "が", "の", "と"], answer: "へ", why: "表示朝某个方向移动，用「へ」。" }
      ]
    },
    {
      p: "と",
      title: "并列·共同「と」",
      read: "to",
      core: "「と」表示“和”：完整列举名词（A和B），或表示一起做事的对象（和谁一起）；还可用于引用别人说的话。",
      uses: [
        { use: "名词并列", jp: "冷蔵庫に卵と牛乳があります。", ruby: "<ruby>冷蔵庫<rt>れいぞうこ</rt></ruby>に<ruby>卵<rt>たまご</rt></ruby>と<ruby>牛乳<rt>ぎゅうにゅう</rt></ruby>があります。", zh: "冰箱里有鸡蛋和牛奶。" },
        { use: "共同动作的对象", jp: "週末は姉と買い物に行きました。", ruby: "<ruby>週末<rt>しゅうまつ</rt></ruby>は<ruby>姉<rt>あね</rt></ruby>と<ruby>買<rt>か</rt></ruby>い<ruby>物<rt>もの</rt></ruby>に<ruby>行<rt>い</rt></ruby>きました。", zh: "周末和姐姐去购物了。" },
        { use: "引用", jp: "先生は「明日はテストです」と言いました。", ruby: "<ruby>先生<rt>せんせい</rt></ruby>は「<ruby>明日<rt>あした</rt></ruby>はテストです」と<ruby>言<rt>い</rt></ruby>いました。", zh: "老师说：“明天考试。”" }
      ],
      pitfall: "中文的“和”能连接动词和句子，但日语「と」表示“和”时只能连接名词：不能说「食べると飲みます」，要说「食べたり飲んだりします」。另外「と」是全部列举，「や」是举例（暗示还有别的）。",
      quiz: [
        { q: "昨日、友達（　）カラオケに行きました。", ruby: "<ruby>昨日<rt>きのう</rt></ruby>、<ruby>友達<rt>ともだち</rt></ruby>（　）カラオケに<ruby>行<rt>い</rt></ruby>きました。", options: ["と", "を", "で", "に"], answer: "と", why: "一起去的同伴用「と」。" },
        { q: "机の上に本（　）ノートがあります。", ruby: "<ruby>机<rt>つくえ</rt></ruby>の<ruby>上<rt>うえ</rt></ruby>に<ruby>本<rt>ほん</rt></ruby>（　）ノートがあります。", options: ["と", "を", "で", "に"], answer: "と", why: "连接两个名词“书和本子”，用「と」。" },
        { q: "彼は「すぐ戻ります」（　）言いました。", ruby: "<ruby>彼<rt>かれ</rt></ruby>は「すぐ<ruby>戻<rt>もど</rt></ruby>ります」（　）<ruby>言<rt>い</rt></ruby>いました。", options: ["と", "を", "に", "で"], answer: "と", why: "引用说话内容时用「と言う」。" }
      ]
    },
    {
      p: "も",
      title: "“也·都”「も」",
      read: "mo",
      core: "「も」表示“也、都”，直接替换「は・が・を」；接在数量词后还可以强调数量之多。",
      uses: [
        { use: "也", jp: "私もその映画が好きです。", ruby: "<ruby>私<rt>わたし</rt></ruby>もその<ruby>映画<rt>えいが</rt></ruby>が<ruby>好<rt>す</rt></ruby>きです。", zh: "我也喜欢那部电影。" },
        { use: "疑问词＋も＋否定", jp: "冷蔵庫には何もありません。", ruby: "<ruby>冷蔵庫<rt>れいぞうこ</rt></ruby>には<ruby>何<rt>なに</rt></ruby>もありません。", zh: "冰箱里什么都没有。" },
        { use: "强调数量多", jp: "駅で一時間も待ちました。", ruby: "<ruby>駅<rt>えき</rt></ruby>で<ruby>一時間<rt>いちじかん</rt></ruby>も<ruby>待<rt>ま</rt></ruby>ちました。", zh: "在车站足足等了一个小时。" }
      ],
      pitfall: "「も」替换「は・が・を」时不与它们叠加：说「私も」「パンも食べます」，不说「私はも」「パンをも食べます」。但「に・で・へ・と」可以和「も」叠加：「東京にも行きました」。",
      quiz: [
        { q: "兄は医者です。そして、弟（　）医者です。", ruby: "<ruby>兄<rt>あに</rt></ruby>は<ruby>医者<rt>いしゃ</rt></ruby>です。そして、<ruby>弟<rt>おとうと</rt></ruby>（　）<ruby>医者<rt>いしゃ</rt></ruby>です。", options: ["も", "を", "で", "に"], answer: "も", why: "弟弟“也”是医生，用「も」替换「は」。" },
        { q: "朝から何（　）食べていません。", ruby: "<ruby>朝<rt>あさ</rt></ruby>から<ruby>何<rt>なに</rt></ruby>（　）<ruby>食<rt>た</rt></ruby>べていません。", options: ["も", "を", "が", "で"], answer: "も", why: "「疑问词＋も＋否定」表示全面否定：什么都没吃。" },
        { q: "このりんごは一つ五百円（　）します。", ruby: "このりんごは<ruby>一<rt>ひと</rt></ruby>つ<ruby>五百円<rt>ごひゃくえん</rt></ruby>（　）します。", options: ["も", "を", "で", "が"], answer: "も", why: "数量词后加「も」，强调价格之高（竟要五百日元）。" }
      ]
    },
    {
      p: "の",
      title: "连接名词「の」",
      read: "no",
      core: "「の」连接名词与名词，表示所属、性质、内容等；也可代替前文出现过的名词，相当于“……的”。",
      uses: [
        { use: "所属", jp: "これは父の傘です。", ruby: "これは<ruby>父<rt>ちち</rt></ruby>の<ruby>傘<rt>かさ</rt></ruby>です。", zh: "这是我爸爸的伞。" },
        { use: "性质·内容", jp: "日本語の先生はとても親切です。", ruby: "<ruby>日本語<rt>にほんご</rt></ruby>の<ruby>先生<rt>せんせい</rt></ruby>はとても<ruby>親切<rt>しんせつ</rt></ruby>です。", zh: "日语老师非常亲切。" },
        { use: "代替名词", jp: "この赤いかばんは私のです。", ruby: "この<ruby>赤<rt>あか</rt></ruby>いかばんは<ruby>私<rt>わたし</rt></ruby>のです。", zh: "这个红色的包是我的。" }
      ],
      pitfall: "中文“的”用得很广，学习者常在形容词后也加「の」：「おいしいのケーキ」「きれいの部屋」都是错的。い形容词直接修饰名词（おいしいケーキ），な形容词要加「な」（きれいな部屋）。",
      quiz: [
        { q: "これは誰（　）スマホですか。", ruby: "これは<ruby>誰<rt>だれ</rt></ruby>（　）スマホですか。", options: ["の", "が", "を", "に"], answer: "の", why: "表示所属（谁的手机），名词之间用「の」。" },
        { q: "駅の近く（　）レストランで昼ご飯を食べました。", ruby: "<ruby>駅<rt>えき</rt></ruby>の<ruby>近<rt>ちか</rt></ruby>く（　）レストランで<ruby>昼<rt>ひる</rt></ruby>ご<ruby>飯<rt>はん</rt></ruby>を<ruby>食<rt>た</rt></ruby>べました。", options: ["の", "に", "で", "を"], answer: "の", why: "「近く」是名词，修饰「レストラン」时用「の」。" },
        { q: "「このペンは陳さんのですか。」「いいえ、それは私（　）です。」", ruby: "「このペンは<ruby>陳<rt>ちん</rt></ruby>さんのですか。」「いいえ、それは<ruby>私<rt>わたし</rt></ruby>（　）です。」", options: ["の", "が", "は", "を"], answer: "の", why: "「私の」代替「私のペン」，表示“我的”。" }
      ]
    },
    {
      p: "から/まで",
      title: "起点·终点「から／まで」",
      read: "kara / made",
      core: "「から」表示起点（时间、场所、来源），「まで」表示终点；两者常成对使用：「AからBまで」＝从A到B。",
      uses: [
        { use: "时间范围", jp: "授業は九時から十二時までです。", ruby: "<ruby>授業<rt>じゅぎょう</rt></ruby>は<ruby>九時<rt>くじ</rt></ruby>から<ruby>十二時<rt>じゅうにじ</rt></ruby>までです。", zh: "课从九点上到十二点。" },
        { use: "场所范围", jp: "家から駅まで歩いて十分です。", ruby: "<ruby>家<rt>いえ</rt></ruby>から<ruby>駅<rt>えき</rt></ruby>まで<ruby>歩<rt>ある</rt></ruby>いて<ruby>十分<rt>じゅっぷん</rt></ruby>です。", zh: "从家到车站走路十分钟。" },
        { use: "来源", jp: "この野菜は祖父からもらいました。", ruby: "この<ruby>野菜<rt>やさい</rt></ruby>は<ruby>祖父<rt>そふ</rt></ruby>からもらいました。", zh: "这些蔬菜是从爷爷那里拿到的。" }
      ],
      pitfall: "「まで」表示动作一直持续到某个时间，「までに」表示截止期限（在……之前完成）。交作业应说「金曜日までに出してください」，说成「金曜日まで出してください」意思就不对了。",
      quiz: [
        { q: "銀行は午前九時（　）午後三時まで開いています。", ruby: "<ruby>銀行<rt>ぎんこう</rt></ruby>は<ruby>午前<rt>ごぜん</rt></ruby><ruby>九時<rt>くじ</rt></ruby>（　）<ruby>午後<rt>ごご</rt></ruby><ruby>三時<rt>さんじ</rt></ruby>まで<ruby>開<rt>あ</rt></ruby>いています。", options: ["から", "まで", "で", "に"], answer: "から", why: "与后面的「まで」成对，表示开始时间用「から」。" },
        { q: "東京から大阪（　）新幹線で行きました。", ruby: "<ruby>東京<rt>とうきょう</rt></ruby>から<ruby>大阪<rt>おおさか</rt></ruby>（　）<ruby>新幹線<rt>しんかんせん</rt></ruby>で<ruby>行<rt>い</rt></ruby>きました。", options: ["まで", "から", "を", "で"], answer: "まで", why: "「AからBまで」表示从起点到终点。" },
        { q: "この宿題は明日（　）出してください。", ruby: "この<ruby>宿題<rt>しゅくだい</rt></ruby>は<ruby>明日<rt>あした</rt></ruby>（　）<ruby>出<rt>だ</rt></ruby>してください。", options: ["まで", "までに", "から", "で"], answer: "までに", why: "交作业是在期限前完成一次的动作，用表示截止的「までに」。" }
      ]
    }
  ],

  /* ---------- 3. 动词活用 ---------- */
  verbs: [
    /* 一类动词（五段） */
    { dict: "書く", kana: "かく", group: 1, zh: "写", masu: "書きます", te: "書いて", ta: "書いた", nai: "書かない", potential: "書ける", volitional: "書こう",
      kanaForms: { masu: "かきます", te: "かいて", ta: "かいた", nai: "かかない", potential: "かける", volitional: "かこう" } },
    { dict: "読む", kana: "よむ", group: 1, zh: "读；看（书）", masu: "読みます", te: "読んで", ta: "読んだ", nai: "読まない", potential: "読める", volitional: "読もう",
      kanaForms: { masu: "よみます", te: "よんで", ta: "よんだ", nai: "よまない", potential: "よめる", volitional: "よもう" } },
    { dict: "話す", kana: "はなす", group: 1, zh: "说；讲", masu: "話します", te: "話して", ta: "話した", nai: "話さない", potential: "話せる", volitional: "話そう",
      kanaForms: { masu: "はなします", te: "はなして", ta: "はなした", nai: "はなさない", potential: "はなせる", volitional: "はなそう" } },
    { dict: "待つ", kana: "まつ", group: 1, zh: "等待", masu: "待ちます", te: "待って", ta: "待った", nai: "待たない", potential: "待てる", volitional: "待とう",
      kanaForms: { masu: "まちます", te: "まって", ta: "まった", nai: "またない", potential: "まてる", volitional: "まとう" } },
    { dict: "買う", kana: "かう", group: 1, zh: "买", masu: "買います", te: "買って", ta: "買った", nai: "買わない", potential: "買える", volitional: "買おう",
      kanaForms: { masu: "かいます", te: "かって", ta: "かった", nai: "かわない", potential: "かえる", volitional: "かおう" } },
    { dict: "飲む", kana: "のむ", group: 1, zh: "喝", masu: "飲みます", te: "飲んで", ta: "飲んだ", nai: "飲まない", potential: "飲める", volitional: "飲もう",
      kanaForms: { masu: "のみます", te: "のんで", ta: "のんだ", nai: "のまない", potential: "のめる", volitional: "のもう" } },
    { dict: "遊ぶ", kana: "あそぶ", group: 1, zh: "玩", masu: "遊びます", te: "遊んで", ta: "遊んだ", nai: "遊ばない", potential: "遊べる", volitional: "遊ぼう",
      kanaForms: { masu: "あそびます", te: "あそんで", ta: "あそんだ", nai: "あそばない", potential: "あそべる", volitional: "あそぼう" } },
    { dict: "死ぬ", kana: "しぬ", group: 1, zh: "死", masu: "死にます", te: "死んで", ta: "死んだ", nai: "死なない", potential: "死ねる", volitional: "死のう",
      kanaForms: { masu: "しにます", te: "しんで", ta: "しんだ", nai: "しなない", potential: "しねる", volitional: "しのう" } },
    { dict: "泳ぐ", kana: "およぐ", group: 1, zh: "游泳", masu: "泳ぎます", te: "泳いで", ta: "泳いだ", nai: "泳がない", potential: "泳げる", volitional: "泳ごう",
      kanaForms: { masu: "およぎます", te: "およいで", ta: "およいだ", nai: "およがない", potential: "およげる", volitional: "およごう" } },
    { dict: "行く", kana: "いく", group: 1, zh: "去", masu: "行きます", te: "行って", ta: "行った", nai: "行かない", potential: "行ける", volitional: "行こう",
      kanaForms: { masu: "いきます", te: "いって", ta: "いった", nai: "いかない", potential: "いける", volitional: "いこう" } },
    { dict: "会う", kana: "あう", group: 1, zh: "见面", masu: "会います", te: "会って", ta: "会った", nai: "会わない", potential: "会える", volitional: "会おう",
      kanaForms: { masu: "あいます", te: "あって", ta: "あった", nai: "あわない", potential: "あえる", volitional: "あおう" } },
    { dict: "聞く", kana: "きく", group: 1, zh: "听；问", masu: "聞きます", te: "聞いて", ta: "聞いた", nai: "聞かない", potential: "聞ける", volitional: "聞こう",
      kanaForms: { masu: "ききます", te: "きいて", ta: "きいた", nai: "きかない", potential: "きける", volitional: "きこう" } },

    /* 二类动词（一段） */
    { dict: "食べる", kana: "たべる", group: 2, zh: "吃", masu: "食べます", te: "食べて", ta: "食べた", nai: "食べない", potential: "食べられる", volitional: "食べよう",
      kanaForms: { masu: "たべます", te: "たべて", ta: "たべた", nai: "たべない", potential: "たべられる", volitional: "たべよう" } },
    { dict: "見る", kana: "みる", group: 2, zh: "看", masu: "見ます", te: "見て", ta: "見た", nai: "見ない", potential: "見られる", volitional: "見よう",
      kanaForms: { masu: "みます", te: "みて", ta: "みた", nai: "みない", potential: "みられる", volitional: "みよう" } },
    { dict: "起きる", kana: "おきる", group: 2, zh: "起床", masu: "起きます", te: "起きて", ta: "起きた", nai: "起きない", potential: "起きられる", volitional: "起きよう",
      kanaForms: { masu: "おきます", te: "おきて", ta: "おきた", nai: "おきない", potential: "おきられる", volitional: "おきよう" } },
    { dict: "寝る", kana: "ねる", group: 2, zh: "睡觉", masu: "寝ます", te: "寝て", ta: "寝た", nai: "寝ない", potential: "寝られる", volitional: "寝よう",
      kanaForms: { masu: "ねます", te: "ねて", ta: "ねた", nai: "ねない", potential: "ねられる", volitional: "ねよう" } },
    { dict: "教える", kana: "おしえる", group: 2, zh: "教；告诉", masu: "教えます", te: "教えて", ta: "教えた", nai: "教えない", potential: "教えられる", volitional: "教えよう",
      kanaForms: { masu: "おしえます", te: "おしえて", ta: "おしえた", nai: "おしえない", potential: "おしえられる", volitional: "おしえよう" } },
    { dict: "着る", kana: "きる", group: 2, zh: "穿（上衣）", masu: "着ます", te: "着て", ta: "着た", nai: "着ない", potential: "着られる", volitional: "着よう",
      kanaForms: { masu: "きます", te: "きて", ta: "きた", nai: "きない", potential: "きられる", volitional: "きよう" } },
    { dict: "出る", kana: "でる", group: 2, zh: "出去；出来", masu: "出ます", te: "出て", ta: "出た", nai: "出ない", potential: "出られる", volitional: "出よう",
      kanaForms: { masu: "でます", te: "でて", ta: "でた", nai: "でない", potential: "でられる", volitional: "でよう" } },
    { dict: "開ける", kana: "あける", group: 2, zh: "打开", masu: "開けます", te: "開けて", ta: "開けた", nai: "開けない", potential: "開けられる", volitional: "開けよう",
      kanaForms: { masu: "あけます", te: "あけて", ta: "あけた", nai: "あけない", potential: "あけられる", volitional: "あけよう" } },
    { dict: "忘れる", kana: "わすれる", group: 2, zh: "忘记", masu: "忘れます", te: "忘れて", ta: "忘れた", nai: "忘れない", potential: "忘れられる", volitional: "忘れよう",
      kanaForms: { masu: "わすれます", te: "わすれて", ta: "わすれた", nai: "わすれない", potential: "わすれられる", volitional: "わすれよう" } },
    { dict: "借りる", kana: "かりる", group: 2, zh: "借（入）", masu: "借ります", te: "借りて", ta: "借りた", nai: "借りない", potential: "借りられる", volitional: "借りよう",
      kanaForms: { masu: "かります", te: "かりて", ta: "かりた", nai: "かりない", potential: "かりられる", volitional: "かりよう" } },
    { dict: "始める", kana: "はじめる", group: 2, zh: "开始（做）", masu: "始めます", te: "始めて", ta: "始めた", nai: "始めない", potential: "始められる", volitional: "始めよう",
      kanaForms: { masu: "はじめます", te: "はじめて", ta: "はじめた", nai: "はじめない", potential: "はじめられる", volitional: "はじめよう" } },
    { dict: "浴びる", kana: "あびる", group: 2, zh: "淋（浴）", masu: "浴びます", te: "浴びて", ta: "浴びた", nai: "浴びない", potential: "浴びられる", volitional: "浴びよう",
      kanaForms: { masu: "あびます", te: "あびて", ta: "あびた", nai: "あびない", potential: "あびられる", volitional: "あびよう" } },

    /* 三类动词（不规则） */
    { dict: "する", kana: "する", group: 3, zh: "做", masu: "します", te: "して", ta: "した", nai: "しない", potential: "できる", volitional: "しよう",
      kanaForms: { masu: "します", te: "して", ta: "した", nai: "しない", potential: "できる", volitional: "しよう" } },
    { dict: "来る", kana: "くる", group: 3, zh: "来", masu: "来ます", te: "来て", ta: "来た", nai: "来ない", potential: "来られる", volitional: "来よう",
      kanaForms: { masu: "きます", te: "きて", ta: "きた", nai: "こない", potential: "こられる", volitional: "こよう" } },

    /* 易错补充：长得像二类的一类动词 等 */
    { dict: "帰る", kana: "かえる", group: 1, zh: "回去；回家", masu: "帰ります", te: "帰って", ta: "帰った", nai: "帰らない", potential: "帰れる", volitional: "帰ろう",
      kanaForms: { masu: "かえります", te: "かえって", ta: "かえった", nai: "かえらない", potential: "かえれる", volitional: "かえろう" } },
    { dict: "入る", kana: "はいる", group: 1, zh: "进入", masu: "入ります", te: "入って", ta: "入った", nai: "入らない", potential: "入れる", volitional: "入ろう",
      kanaForms: { masu: "はいります", te: "はいって", ta: "はいった", nai: "はいらない", potential: "はいれる", volitional: "はいろう" } },
    { dict: "走る", kana: "はしる", group: 1, zh: "跑", masu: "走ります", te: "走って", ta: "走った", nai: "走らない", potential: "走れる", volitional: "走ろう",
      kanaForms: { masu: "はしります", te: "はしって", ta: "はしった", nai: "はしらない", potential: "はしれる", volitional: "はしろう" } },
    { dict: "知る", kana: "しる", group: 1, zh: "知道；得知", masu: "知ります", te: "知って", ta: "知った", nai: "知らない", potential: "知れる", volitional: "知ろう",
      kanaForms: { masu: "しります", te: "しって", ta: "しった", nai: "しらない", potential: "しれる", volitional: "しろう" } },
    { dict: "切る", kana: "きる", group: 1, zh: "切；剪", masu: "切ります", te: "切って", ta: "切った", nai: "切らない", potential: "切れる", volitional: "切ろう",
      kanaForms: { masu: "きります", te: "きって", ta: "きった", nai: "きらない", potential: "きれる", volitional: "きろう" } },
    { dict: "作る", kana: "つくる", group: 1, zh: "做；制作", masu: "作ります", te: "作って", ta: "作った", nai: "作らない", potential: "作れる", volitional: "作ろう",
      kanaForms: { masu: "つくります", te: "つくって", ta: "つくった", nai: "つくらない", potential: "つくれる", volitional: "つくろう" } },
    { dict: "取る", kana: "とる", group: 1, zh: "拿；取", masu: "取ります", te: "取って", ta: "取った", nai: "取らない", potential: "取れる", volitional: "取ろう",
      kanaForms: { masu: "とります", te: "とって", ta: "とった", nai: "とらない", potential: "とれる", volitional: "とろう" } },
    { dict: "降りる", kana: "おりる", group: 2, zh: "下（车）", masu: "降ります", te: "降りて", ta: "降りた", nai: "降りない", potential: "降りられる", volitional: "降りよう",
      kanaForms: { masu: "おります", te: "おりて", ta: "おりた", nai: "おりない", potential: "おりられる", volitional: "おりよう" } },
    { dict: "覚える", kana: "おぼえる", group: 2, zh: "记住", masu: "覚えます", te: "覚えて", ta: "覚えた", nai: "覚えない", potential: "覚えられる", volitional: "覚えよう",
      kanaForms: { masu: "おぼえます", te: "おぼえて", ta: "おぼえた", nai: "おぼえない", potential: "おぼえられる", volitional: "おぼえよう" } },
    { dict: "勉強する", kana: "べんきょうする", group: 3, zh: "学习", masu: "勉強します", te: "勉強して", ta: "勉強した", nai: "勉強しない", potential: "勉強できる", volitional: "勉強しよう",
      kanaForms: { masu: "べんきょうします", te: "べんきょうして", ta: "べんきょうした", nai: "べんきょうしない", potential: "べんきょうできる", volitional: "べんきょうしよう" } }
  ],

  /* ---------- 4. 动词练习题型 ---------- */
  verbQuizForms: [
    { key: "masu", label: "ます形" },
    { key: "te", label: "て形" },
    { key: "ta", label: "た形" },
    { key: "nai", label: "ない形" },
    { key: "potential", label: "可能形" },
    { key: "volitional", label: "意志形" }
  ]
};
