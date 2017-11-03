# tinyjs-plugin-audio

> Tiny.js 音效插件

## 查看demo

`demo/index.html`

## 引用方法

- 推荐作为依赖使用

  - `npm install tinyjs-plugin-audio --save`

- 也可以直接引用线上cdn地址，注意要使用最新的版本号，例如：

  - https://a.alipayobjects.com/g/tiny-plugins/tinyjs-plugin-audio/1.1.0/index.js
  - https://a.alipayobjects.com/g/tiny-plugins/tinyjs-plugin-audio/1.1.0/index.debug.js

## 起步
首先当然是要引入，推荐`NPM`方式，当然你也可以使用`CDN`或下载独立版本，先从几个例子入手吧！

##### 1、最简单的例子

引用 Tiny.js 源码
``` html
<script src="https://a.alipayobjects.com/g/tiny/tiny/1.1.5/tiny.js"></script>
```
``` js
require('tinyjs-plugin-audio');
// 或者
// import audio from 'tinyjs-plugin-audio';

// 加载音频并获取 Audio 对象
var loader = new Tiny.loaders.Loader();
loader.add([
  {name: 'music', url: 'https://os.alipayobjects.com/rmsportal/aVTYsHoGDVBnqXKuYDrs.mp3'}
]).load(function() {
  var music = Tiny.audio.manager.getAudio('music');
  // music.play();
  // music.stop();
});
```

## 依赖
- `Tiny.js`: [Link](http://tinyjs.net/#/docs/api)

## 注意事项
- ios11 对于音频播放更加严格，建议ios10及以上全部使用web audio模式播放。
  - 当使用disableWebAudio模式时（即使用audioelement播放），会导致load被堵塞无法完成加载。因为ios11把音频加载完全阻止。

  ```js
  //简单的示例，最终以实际情况为准。
  var ua = window.navigator.userAgent;
  var matches = ua.match(/Version\/(\d+)/);
  if(ua.indexOf('iPhone') > -1 && matches[1] >= 10) {
    window.disableWebAudio = false;
  } else {
    window.disableWebAudio = true;
  }
  //安卓根据设备自行判断机型决定使用哪种模式。
  ```
- ios10以下对audioContext支持不好。会出现播放音频迟缓，杂音很重甚至会听不到音乐。

  - 建议ios10以下使用audio标签方式播放。使用姿势，在引入tinyjs-plugin-audio之前，配置window.disableWebAudio = true，即可。
  - 当使用disableWebAudio模式时，AudioAnalyser将无法使用，实例化会warning，接口会返回[]和0。
  - 当使用disableWebAudio模式时，ios表现为volume无法set，get始终返回1。原因是ios物理音量优先级高于audio音量控制，不允许js设置音量。

- ios9以下退出webview或压后台音乐不会暂停。

  - 建议监听相应系统事件清掉audio对象或暂停音乐播放

- ios默认不允许音频自动播放问题。

  - 建议在tiny资源加载完成后，通过用户行为触发音频播放。（如document触发点击，就调用play方法。）

- [重要]建议所有资源统一加载。如果特殊情况需要后加载，需要重新实例化一个tiny loader。

  ``` js
  //重新实例化loader，不要直接在Tiny.loader上直接调用add方法，将会导致资源无法加载。
  var loader = new Tiny.loaders.Loader();
  loader.add({
    {name: 'music', url: 'https://os.alipayobjects.com/rmsportal/aVTYsHoGDVBnqXKuYDrs.mp3'}
  }).load(function() {
    var music = Tiny.audio.manager.getAudio('music');
    //your code here
  });
  ```
