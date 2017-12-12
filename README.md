# tinyjs-plugin-audio

> Tiny.js 音效插件

## 查看demo

http://tinyjs.net/#/plugins/tinyjs-plugin-audio/demo

## 引用方法

- 推荐作为依赖使用

  - `npm install tinyjs-plugin-audio --save`

- 也可以直接引用线上cdn地址，注意要使用最新的版本号，例如：

  - https://gw.alipayobjects.com/as/g/tiny-plugins/tinyjs-plugin-audio/1.1.1/index.js
  - https://gw.alipayobjects.com/as/g/tiny-plugins/tinyjs-plugin-audio/1.1.1/index.debug.js

## 起步
首先当然是要引入，推荐`NPM`方式，当然你也可以使用`CDN`或下载独立版本，先从几个例子入手吧！

##### 1、最简单的例子

引用 Tiny.js 源码
``` html
<script src="https://gw.alipayobjects.com/as/g/tiny/tiny/1.1.5/tiny.js"></script>
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
- iOS 11 对于音频播放更加严格，建议 iOS 10 及以上全部使用 WebAudio 模式播放。
  - 当使用 `disableWebAudio` 模式时（即使用 `AudioElement` 播放），会导致 load 被堵塞无法完成加载。因为 iOS 11 把音频加载完全阻止。

  ``` js
  // 简单的示例，最终以实际情况为准。(注意 iOS 8 模拟器 ua 存在问题，8.3 以后得到修复。)
  var ua = window.navigator.userAgent;
  var matchesSafari = ua.match(/Version\/(\d+)/);
  var matchesOS = ua.match(/OS\s(\d+)/);
  if(ua.indexOf('iPhone') > -1 && (matchesOS[1] >= 10 || matchesSafari[1] >= 10)) {
    window.disableWebAudio = false;
  } else {
    window.disableWebAudio = true;
  }
  // 安卓根据设备自行判断机型决定使用哪种模式。
  ```
- iOS 10 以下对 `audioContext` 支持不好。会出现播放音频迟缓，杂音很重甚至会听不到音乐。

  - 建议 iOS 10 以下使用 `audio` 标签方式播放。使用姿势，在引入 tinyjs-plugin-audio 之前，配置 `window.disableWebAudio = true` 即可。
  - 当使用 disableWebAudio 模式时，`AudioAnalyser` 将无法使用，实例化会 warning，接口会返回[]和0。
  - 当使用 disableWebAudio 模式时，iOS 表现为 `volume` 无法 `set`，`get` 始终返回 1。原因是 `iOS` 物理音量优先级高于 `audio` 音量控制，不允许 js 设置音量。

- iOS 9 以下退出 WebView 或压后台音乐不会暂停。

  - 建议监听相应系统事件清掉 audio 对象或暂停音乐播放

- iOS 默认不允许音频自动播放问题。

  - 建议在 Tiny 的 `Loader` 资源加载完成后，通过用户行为触发音频播放。（如 document 触发点击，就调用 play 方法。）

- [重要]建议所有资源统一加载。如果特殊情况需要后加载，需要重新实例化一个 Tiny `Loader`。

  ``` js
  // 重新实例化 loader，不要直接在 Tiny.loader 上直接调用 add 方法，将会导致资源无法加载。
  var loader = new Tiny.loaders.Loader();
  loader.add({
    {name: 'music', url: 'https://os.alipayobjects.com/rmsportal/aVTYsHoGDVBnqXKuYDrs.mp3'}
  }).load(function() {
    var music = Tiny.audio.manager.getAudio('music');
    //your code here
  });
  ```
