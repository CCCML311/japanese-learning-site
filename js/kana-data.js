/* 五十音数据：[平假名, 片假名, 罗马音, 音频文件名]
   音频文件放在 audio/kana/<文件名>.mp3（平假名和片假名读音相同，共用一个文件）。
   null 表示表格里的空位。 */
(function () {
  function row(h, k, r, f) { return h ? [h, k, r, f || r] : null; }
  window.KANA = {
    seion: [
      row('あ','ア','a'),row('い','イ','i'),row('う','ウ','u'),row('え','エ','e'),row('お','オ','o'),
      row('か','カ','ka'),row('き','キ','ki'),row('く','ク','ku'),row('け','ケ','ke'),row('こ','コ','ko'),
      row('さ','サ','sa'),row('し','シ','shi'),row('す','ス','su'),row('せ','セ','se'),row('そ','ソ','so'),
      row('た','タ','ta'),row('ち','チ','chi'),row('つ','ツ','tsu'),row('て','テ','te'),row('と','ト','to'),
      row('な','ナ','na'),row('に','ニ','ni'),row('ぬ','ヌ','nu'),row('ね','ネ','ne'),row('の','ノ','no'),
      row('は','ハ','ha'),row('ひ','ヒ','hi'),row('ふ','フ','fu'),row('へ','ヘ','he'),row('ほ','ホ','ho'),
      row('ま','マ','ma'),row('み','ミ','mi'),row('む','ム','mu'),row('め','メ','me'),row('も','モ','mo'),
      row('や','ヤ','ya'),null,row('ゆ','ユ','yu'),null,row('よ','ヨ','yo'),
      row('ら','ラ','ra'),row('り','リ','ri'),row('る','ル','ru'),row('れ','レ','re'),row('ろ','ロ','ro'),
      row('わ','ワ','wa'),null,null,null,row('を','ヲ','wo','o2'),
      row('ん','ン','n'),null,null,null,null
    ],
    dakuon: [
      row('が','ガ','ga'),row('ぎ','ギ','gi'),row('ぐ','グ','gu'),row('げ','ゲ','ge'),row('ご','ゴ','go'),
      row('ざ','ザ','za'),row('じ','ジ','ji'),row('ず','ズ','zu'),row('ぜ','ゼ','ze'),row('ぞ','ゾ','zo'),
      row('だ','ダ','da'),row('ぢ','ヂ','ji (di)','di'),row('づ','ヅ','zu (du)','du'),row('で','デ','de'),row('ど','ド','do'),
      row('ば','バ','ba'),row('び','ビ','bi'),row('ぶ','ブ','bu'),row('べ','ベ','be'),row('ぼ','ボ','bo'),
      row('ぱ','パ','pa'),row('ぴ','ピ','pi'),row('ぷ','プ','pu'),row('ぺ','ペ','pe'),row('ぽ','ポ','po')
    ],
    yoon: [
      row('きゃ','キャ','kya'),row('きゅ','キュ','kyu'),row('きょ','キョ','kyo'),
      row('しゃ','シャ','sha'),row('しゅ','シュ','shu'),row('しょ','ショ','sho'),
      row('ちゃ','チャ','cha'),row('ちゅ','チュ','chu'),row('ちょ','チョ','cho'),
      row('にゃ','ニャ','nya'),row('にゅ','ニュ','nyu'),row('にょ','ニョ','nyo'),
      row('ひゃ','ヒャ','hya'),row('ひゅ','ヒュ','hyu'),row('ひょ','ヒョ','hyo'),
      row('みゃ','ミャ','mya'),row('みゅ','ミュ','myu'),row('みょ','ミョ','myo'),
      row('りゃ','リャ','rya'),row('りゅ','リュ','ryu'),row('りょ','リョ','ryo'),
      row('ぎゃ','ギャ','gya'),row('ぎゅ','ギュ','gyu'),row('ぎょ','ギョ','gyo'),
      row('じゃ','ジャ','ja'),row('じゅ','ジュ','ju'),row('じょ','ジョ','jo'),
      row('びゃ','ビャ','bya'),row('びゅ','ビュ','byu'),row('びょ','ビョ','byo'),
      row('ぴゃ','ピャ','pya'),row('ぴゅ','ピュ','pyu'),row('ぴょ','ピョ','pyo')
    ]
  };
  /* 测验题库：去掉空位，并排除读音与其他假名重复的 ぢ/づ/を，避免出现两个正确答案 */
  window.KANA.pool = function (groups) {
    var out = [];
    groups.forEach(function (g) {
      (window.KANA[g] || []).forEach(function (k) {
        if (k && ['di', 'du', 'o2'].indexOf(k[3]) < 0) out.push({ h: k[0], k: k[1], r: k[2], f: k[3] });
      });
    });
    return out;
  };
})();
