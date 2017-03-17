'use strict';

var exactKey = {
  'BZ': {
    key: 'bz',
    content: 'tom在此恭候多时！\n' +
      '回复命令+关键词获取信息\n' +
      '目前支持的功能如下：\n\n' +
      '获取最新博客：\n'+
      '   如: a 1\n'+
      ' 获取天气:\n' +
      '   如：w 上海'
  },
  'HELP': {
    key: 'help',
    content: '测试'
  },
  'CMD_1':{
      key: 'cmd_1',
      content: 'command_1',
      desc:"打开闪光灯"

  },'CMD_2':{
        key: 'cmd_2',
        content: 'command_2',
        desc:"关闭闪光灯"
    },'CMD_3':{
        key: 'cmd_3',
        content: 'command_3',
        desc:"截图闪光灯"
    },'CMD_4':{
        key: 'cmd_4',
        content: 'command_4',
        desc:"振动"
    }

};

module.exports = {
  exactKey: exactKey
};
