if (typeof doyoo == 'undefined' || !doyoo) {
  var d_genId = function () {
    var id = '',
      ids = '0123456789abcdef';
    for (var i = 0; i < 32; i++) {
      id += ids.charAt(Math.floor(Math.random() * 16));
    }
    return id;
  };

  var schema = 'https';
  if (location.href.indexOf('https:') == 0) {
    schema = 'https';
  }
  var doyoo = {
    env: {
      secure: schema == 'https',
      mon: schema + '://m7827.talk99.cn/monitor',
      chat: schema + '://chat7811.talk99.cn/chat',
      file: schema + '://aux.soperson.com/131221',
      compId: 20003623,
      confId: 10098212,
      workDomain: '',
      vId: d_genId(),
      lang: 'sc',
      fixFlash: 0,
      fixMobileScale: 0,
      subComp: 0,
      _mark: 'ce2a70ad61df00430d182a55566d37b196dbd6f05b686896d7d79fa520492ada8f81a051f6ee7aed'
    },
    chat: {
      mobileColor: '',
      mobileHeight: 80,
      mobileChatHintBottom: 0,
      mobileChatHintMode: 0,
      mobileChatHintColor: '',
      mobileChatHintSize: 0,
      priorMiniChat: 0
    }

    ,
    monParam: {
      index: 1,
      preferConfig: 0,

      title: '',
      text: '',
      auto: -1,
      group: '10080632',
      start: '00:00',
      end: '24:00',
      mask: false,
      status: false,
      fx: 0,
      mini: 1,
      pos: 0,
      offShow: 1,
      loop: 0,
      autoHide: 0,
      hidePanel: 0,
      miniStyle: '#0680b2',
      miniWidth: '340',
      miniHeight: '490',
      showPhone: 0,
      monHideStatus: [0, 0, 0],
      monShowOnly: '',
      autoDirectChat: -1,
      allowMobileDirect: 0,
      minBallon: 1,
      chatFollow: 1,
      backCloseChat: 0,
      ratio: 0
    }




  };

  if (typeof talk99Init == 'function') {
    talk99Init(doyoo);
  }
  if (!document.getElementById('doyoo_panel')) {
    var supportJquery = typeof jQuery != 'undefined';
    var doyooWrite = function (html) {
      document.writeln(html);
    }

    doyooWrite('<div id="doyoo_panel"></div>');


    doyooWrite('<div id="doyoo_monitor"></div>');


    doyooWrite('<div id="talk99_message"></div>')

    doyooWrite('<div id="doyoo_share" style="display:none;"></div>');
    doyooWrite('<lin' + 'k rel="stylesheet" type="text/css" href="' + schema + '://aux.soperson.com/131221/oms.css?190803"></li' + 'nk>');
    doyooWrite('<scr' + 'ipt type="text/javascript" src="' + schema + '://aux.soperson.com/131221/oms.js?190811" charset="utf-8"></scr' + 'ipt>');
  }
}