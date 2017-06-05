import "whatwg-fetch";

// ------------------------------------
// Constants
// ------------------------------------

// ------------------------------------
// Actions
// ------------------------------------

/*  This is a thunk, meaning it is a function that immediately
    returns a function for lazy evaluation. It is incredibly useful for
    creating async actions, especially when combined with redux-thunk! */

export const actions = {}

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  questions: [
    {
      title: "請注意！",
      description: "本測驗將協助您瞭解您在您騎乘車輛的途中可能違反的相關規定、裁罰，並建議您可行的作法。此項測驗將不會蒐集任何個人資料，測驗結果僅供參考。（白話文：我不想知道你是誰，這邊寫啥也他媽的不負任何責任）",
      answers:
      [
        { string: "已瞭解並同意", goto: 1, conditions: [] },
        { string: "不同意", goto: 99, conditions: ["GODIE"] }
      ]
    },
    {
      title: "活動地區",
      description: "請問您居住在、經常經過或打算經過下列哪個縣市？",
      answers:
      [
        { string: "台北市", goto: 2, conditions: ["TPE"] },
        { string: "新北市", goto: 2, conditions: ["XBE"] },
        { string: "台中市、彰化縣", goto: 2, conditions: ["TCH"] },
        { string: "台南市", goto: 2, conditions: ["TNN"] },
        { string: "其它縣市", goto: 2, conditions: ["OTH"] }
      ]
    },
    {
      title: "活動時段及目的",
      description: "請問您經常在哪些時間帶騎車，目的是？",
      answers:
      [
        { string: "平日通勤（日班，06-22時往來）", goto: 3, conditions: ["DAY", "WORK"] },
        { string: "平日通勤（夜班，22-06時往來）", goto: 3, conditions: ["NIGHT", "WORK"] },
        { string: "出遊（日間，06-22時）", goto: 3, conditions: ["DAY", "PLAY"] },
        { string: "出遊（夜間，22-06時）", goto: 3, conditions: ["NIGHT", "PLAY"] },
        { string: "都會，或是沒有固定時間", goto: 3, conditions: ["DAY", "NIGHT", "WORK", "PLAY"] }
      ]
    },
    {
      title: "車型",
      description: "請問您是騎乘哪種車型？",
      answers:
      [
        { string: "速可達（<250cc）", goto: 4, conditions: ["LOWDISP", "SHEEP"] },
        { string: "速可達（≥250cc）", goto: 4, conditions: ["HIGHDISP", "SHEEP"] },
        { string: "檔車（<250cc））", goto: 4, conditions: ["LOWDISP", "GEARS"] },
        { string: "檔車（≥250cc）", goto: 4, conditions: ["HIGHDISP", "GEARS"] }
      ]
    },
    {
      title: "購入來源",
      description: "請問您從哪個管道購買這輛車？",
      answers:
      [
        { string: "國產車經銷商、進口車總代理", goto: 5, conditions: ["SOURCE_LICENSED"] },
        { string: "貿易商及其經銷體系", goto: 5, conditions: ["SOURCE_TRADE"] },
        { string: "中古車，不確定", goto: 5, conditions: ["SOURCE_UNKNOWN"] },
        { string: "沒有概念", goto: 5, conditions: ["SOURCE_UNKNOWN"] }
      ]
    },
    {
      title: "排氣管",
      description: "請問您車上的排氣管是？",
      answers:
      [
        { string: "原廠標準樣式", goto: 6, conditions: ["FACTORY_EXHAU"] },
        { string: "原廠特仕版或升級套件", goto: 6, conditions: ["FACTORY_EXHAU", "MODIFIED"] },
        { string: "國內改裝", goto: 6, conditions: ["MODIFIED", "DOMES_MEXHAU"] },
        { string: "進口改裝", goto: 6, conditions: ["MODIFIED", "IMPOR_MEXHAU"] },
        { string: "電動車無排氣管", goto: 12, conditions: ["NO_EXHAU"] }
      ]
    },
    {
      title: "排氣管形式",
      description: "請問您的排氣形式、管身及出口的角度？",
      answers:
      [
        { string: "中出或底排", goto: 8, conditions: ["CENTRE_OUT"] },
        { string: "側排，尾段水平，出口水平", goto: 7, conditions: ["SIDEHOR", "OUTHOR"] },
        { string: "側排，尾段水平，出口斜上", goto: 7, conditions: ["SIDEHOR", "OUTUP"] },
        { string: "側排，尾段斜上，出口水平", goto: 7, conditions: ["SIDEUP", "OUTHOR"] },
        { string: "側排，尾段斜上，出口斜上", goto: 7, conditions: ["SIDEUP", "OUTUP"] },
      ]
    },
    {
      title: "隔熱裝置",
      description: "請問您的排氣管是否裝置「排氣管隔熱裝置（俗稱：防燙蓋）」？",
      answers:
      [
        { string: "有", goto: 8, conditions: ["COVERED"] },
        { string: "本來沒有，蓋一個上去裝飾", goto: 8, conditions: ["COVERED", "FAKE_COVER"] },
        { string: "沒有，但排氣管有隔熱材質或設計", goto: 8, conditions: ["NO_COVER", "REDUCE_HEAT"] },
        { string: "沒有，連自己都被燙到", goto: 8, conditions: ["NO_COVER"] }
      ]
    },
    {
      title: "消音設備",
      description: "請問您的排氣管有安裝消音塞嗎？",
      answers:
      [
        { string: "可拆式，有安裝", goto: 10, conditions: ["REMOVABLE_SILNCR"] },
        { string: "可拆式，沒有安裝", goto: 9, conditions: ["REMOVABLE_SILNCR", "UNINSTALLED_SILNCR"] },
        { string: "不可拆式", goto: 9, conditions: ["STATIC_SILNCR"] },
        { string: "沒有概念", goto: 9, conditions: ["UNKNOWN_SILNCR"] }
      ]
    },
    {
      title: "消音塞/觸媒/閥門",
      description: "請試著從排氣管尾段出口向內打燈直視，窺視內部構造。",
      answers:
      [
        { string: "出口貫通至中段", goto: 10, conditions: ["STRAIGHT_DISP"] },
        { string: "出口至中段有東西遮擋", goto: 10, conditions: ["NON_STRAIGHT_DISP"] },
        { string: "不知道怎麼做", goto: 10, conditions: ["UNKNOWN_DISP"] }
      ]
    },
    {
      title: "檢驗合格貼紙",
      description: "請問目前您車上的排氣管是否已張貼行政院環保署目前試辦之「噪音檢驗合格貼紙（俗稱：乖寶寶貼紙）」？",
      answers:
      [
        { string: "已檢驗通過並張貼", goto: 12, conditions: ["STKR_PASSED", "STKR_PASTED"] },
        { string: "已張貼，但快爛掉了", goto: 12, conditions: ["STKR_PASSED", "STKR_PASTED", "STKR_DAMAGED"] },
        { string: "已檢驗但未獲得", goto: 11, conditions: ["STIEKER_NOPASS"] },
        { string: "未檢驗", goto: 11, conditions: ["UNSTKR_VERIFY"] }
      ]
    },
    {
      title: "噪音",
      description: "您的排氣管吵嗎？",
      answers:
      [
        { string: "已使用科學儀器測量，在標準內", goto: 12, conditions: ["NOISE_SELF", "NOISE_PASSED"] },
        { string: "已使用科學儀器測量，超出標準", goto: 12, conditions: ["NOISE_SELF", "NOISE_NOISY"] },
        { string: "不感覺吵", goto: 12, conditions: ["NOISE_SOSO"] },
        { string: "其實還蠻吵的", goto: 12, conditions: ["NOISE_NOISY"] },
        { string: "不知道耶", goto: 12, conditions: ["NOISE_UNKNOWN"] }
      ]
    },
    {
      title: "其它改裝",
      description: "請問除了排氣管外，車上是否有其它改裝？",
      answers:
      [
        { string: "有改裝", goto: 99, conditions: ["OTHER_MODIFY"] },
        { string: "原廠斷料，改裝不同外觀部件", goto: 99, conditions: ["NO_FACTORY", "THPTY_PART"] },
        { string: "原廠斷料，安裝副廠相同外觀部件", goto: 99, conditions: ["NO_FACTORY", "OTHER_MODIFY"] },
        { string: "100%保證純原廠", goto: 99, conditions: ["ALL_FACTORY"] }
      ]
    }
  ],
  processing: [
    "路邊擺攤攔檢的警察正在皺眉搔搔頭翻法規手冊中......",
    "路邊擺攤攔檢的警察正打著呵欠捲起法規手冊試圖塞進您的排氣管中......",
    "聯合稽查的監理/環保人員正在捻鬍鬚撥瀏海翻法規手冊中......",
    "監理站裡的監理人員正在把拿去墊便當的法規手冊抽出來中......",
    "監理站裡的監理人員正撿起揮揮手時從袖口掉出的幾張法規手冊書頁中......",
    "環保稽查人員正在找冷氣遙控器，不小心發現一本法規手冊......",
    "環保稽查人員正在工廠排放的黑煙中尋找法規手冊中......",
    "環保稽查人員一邊摀著耳朵一邊說你很吵一邊找法規手冊中......",
    "啊呀！環保局長不小心搞錯法條了，幕僚正在幫忙查法規中......"
  ],
  results: {
    occurs: [
      {
        conditions: ["GODIE"],
        string: "我現在就想告你騷擾"
      },
      {
        conditions: ["TPE", "XBE", "TCH", "TNN", "OTH"],
        string: "任何民眾向環保局檢舉您疑似噪音污染"
      },
      {
        conditions: ["TPE", "XBE", "TCH", "TNN", "OTH"],
        string: "任何民眾向監理單位檢舉您疑似非法改裝"
      },
      {
        conditions: ["TPE", "XBE", "TCH", "PLAY"],
        string: "環保人員走在路上看到後回單位舉發您"
      },
      {
        conditions: ["XBE", "TCH", "WORK"],
        string: "上下班途中受到警察攔檢，拍照向環保或監理單位告發您"
      },
      {
        conditions: ["XBE", "TCH", "DAY", "PLAY"],
        string: "騎車出遊途中受到警察攔檢，拍照向環保或監理單位告發您"
      },
      {
        conditions: ["XBE", "TCH", "NIGHT", "PLAY"],
        string: "騎車出遊途中行經聯合稽查被警察攔下"
      }
    ],
    rules: [
      {
        conditions: ["GODIE", "ALL_FACTORY"],
        string: "家規校規班規之類的吧"
      },
      {
        conditions: ["MODIFIED", "SOURCE_TRADE", "OTHER_MODIFY", "THPTY_PART"],
        string: "道路交通管理處罰條例：第16條，第一項，第一款（罰鍰900元~1,800元）"
      },
      {
        conditions: ["MODIFIED", "OUTUP", "NO_COVER", "SOURCE_TRADE", "STRAIGHT_DISP", "OTHER_MODIFY", "THPTY_PART"],
        string: "道路交通管理處罰條例：第16條，第一項，第二款（罰鍰900元~1,800元）"
      },
      {
        conditions: ["UNINSTALLED_SILNCR", "STRAIGHT_DISP", "STIEKER_NOPASS", "NOISE_NOISY", "NOISE_SOSO"],
        string: "道路交通管理處罰條例：第43條，第一項，第五款（罰鍰6,000元~24,000元）"
      },
      {
        conditions: ["UNINSTALLED_SILNCR", "STRAIGHT_DISP", "STIEKER_NOPASS", "NOISE_NOISY", "NOISE_SOSO"],
        string: "噪音管制法：第8條（罰鍰3,000元~30,000元，可按次裁罰）"
      }
    ],
    subject: [
      {
        conditions: ["GODIE"],
        string: "怕屁？"
      },
      {
        conditions: ["GODIE"],
        string: "你來亂的嗎？"
      },
      {
        conditions: [],
        string: "你連你自己的車都不關心了還來點這個浪費你自己時間？"
      },
      {
        conditions: ["OUTUP", "MODIFIED", "NO_COVER", "UNINSTALLED_SILNCR"],
        string: "收到或將會收到來自監理單位，要求您在指定時限前於任一監理單位受理時間進行「車輛臨時檢驗」的通知書。"
      },
      {
        conditions: ["MODIFIED", "UNINSTALLED_SILNCR", "STRAIGHT_DISP", "UNSTKR_VERIFY", "NOISE_SOSO", "NOISE_NOISY"],
        string: "收到或將會收到來自環保單位，要求您在指定時限前於指定時段至指定地點進行「車輛噪音檢驗」的通知書。"
      },
      {
        conditions: ["MODIFIED", "UNINSTALLED_SILNCR", "STRAIGHT_DISP", "STIEKER_NOPASS", "UNSTKR_VERIFY", "NOISE_SOSO", "NOISE_NOISY"],
        string: "遭遇聯合稽查時，若噪音檢測未通過，您將可能在現場同時依「道路交通管理處罰條例第43條」與「噪音管制法第8條」等受到裁罰。"
      },
      {
        conditions: ["MODIFIED", "OUTUP", "NO_COVER", "OTHER_MODIFY", "THPTY_PART"],
        string: "遭遇聯合稽查時，您還可能受到「道路交通管理處罰條例第16條」裁罰。"
      },
      {
        conditions: ["MODIFIED", "OUTUP", "NO_COVER", "UNINSTALLED_SILNCR", "STRAIGHT_DISP", "STIEKER_NOPASS", "UNSTKR_VERIFY", "NOISE_SOSO", "NOISE_NOISY", "OTHER_MODIFY", "THPTY_PART"],
        string: "有非常高的機會即刻收到有關上述條例的罰單。"
      },
      {
        conditions: ["UNINSTALLED_SILNCR", "STRAIGHT_DISP", "STIEKER_NOPASS", "UNSTKR_VERIFY", "NOISE_SOSO", "NOISE_NOISY", "OTHER_MODIFY", "THPTY_PART"],
        string: "目前並無方式防止您短期內再次受到相同的處分。"
      }
    ],
    shalldo: [
      {
        conditions: ["GODIE"],
        string: "吃藥接受治療"
      },
      {
        conditions: ["MODIFIED", "NO_COVER", "REMOVABLE_SILNCR", "STRAIGHT_DISP", "UNSTKR_VERIFY", "NOISE_SOSO", "NOISE_NOISY", "OTHER_MODIFY", "THPTY_PART"],
        string: "除繳納罰鍰及累計違規點數外，您需要依照指示參與車輛檢驗。"
      },
      {
        conditions: ["NO_EXHAU"],
        string: "不過，您根本就沒有排氣管，不是嗎？沒東西可以檢驗吶。"
      },
      {
        conditions: ["SOURCE_TRADE", "IMPOR_MEXHAU", "STIEKER_NOPASS", "UNSTKR_VERIFY"],
        string: "若您希望您的排氣管受到合法環保認證，您必須至環保機關指定之代驗機構進行檢驗，需自費8000元檢驗費用。"
      },
      {
        conditions: ["OUTUP"],
        string: "若您的排氣管出口並非水平或向下，您必須修改出口。"
      },
      {
        conditions: ["REMOVABLE_SILNCR", "UNINSTALLED_SILNCR", "THPTY_PART"],
        string: "若您的排氣管沒有消音塞，您必須設法安裝，儘管它本來可能沒有。"
      },
      {
        conditions: ["NO_COVER", "REDUCE_HEAT", "THPTY_PART"],
        string: "若您的排氣管沒有明顯防燙蓋，您必須設法安裝，儘管它本來可能沒有。"
      },
      {
        conditions: ["FACTORY_EXHAU", "THPTY_PART"],
        string: "若您的排氣管來自原廠，您需要向原廠取得相關檢驗文件以證明此為合乎相關規範之原裝排氣管。"
      },
      {
        conditions: ["DOMES_MEXHAU", "THPTY_PART"],
        string: "若您的排氣管來自國內改裝廠，您需要向廠商取得相關檢驗文件以證明此為合乎相關規範之改裝排氣管。"
      }
    ]
  }
}

export default function homeReducer (state = initialState, action) {
  switch (action.type) {
    default:
      return state
  }
}
