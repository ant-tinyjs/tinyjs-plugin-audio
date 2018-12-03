/**
 * @file        Tiny.js 音效插件
 * @author      fangjun.yfj
 */

/**
 * @module audio
 */

/**
 * Tiny.js
 * @external Tiny
 * @see {@link http://tinyjs.net/}
 */

import utils from './utils';
import AudioManager from './AudioManager';
import Audio from './Audio';
import { audioParser, audioUrlParser } from './audioParser';
import AudioAnalyser from './AudioAnalyser';

/**
 * 音效对象
 *<br>
 * > Tips: 通过 `audio.com` 可以获取到 `Audio`、`AudioManager` 类和音频的 `utils` 对象。
 *
 * @example
 *
 * Object {
 *  Audio: function Audio(data, manager)
 *  AudioManager: function AudioManager()
 *  ..
 *  utils: Object {
 *    ..
 *    globalWebAudioContext: AudioContext
 *    isAudioSupported: true
 *    isHTMLAudioSupported: true
 *    isM4aSupported: true
 *    isMp3Supported: true
 *    isOggSupported: true
 *    isWavSupported: true
 *    isWebAudioSupported: true
 *    webAudioContext: function AudioContext()
 *  }
 * }
 *
 * @name com
 * @return {object}
 * @static
 */
const com = {
  utils,
  AudioManager,
  AudioAnalyser,
  Audio,
  audioParser,
  audioUrlParser,
};

const loader = Tiny.loaders.Loader;
loader.addTinyMiddleware(com.audioParser);

const baseAdd = loader.prototype.add;
loader.prototype.add = function(name, url, options, cb) {
  if (typeof name === 'object') {
    if (Object.prototype.toString.call(name.url) === '[object Array]') {
      name.url = com.audioUrlParser(name.url);
    }
  }

  if (Object.prototype.toString.call(url) === '[object Array]') {
    url = com.audioUrlParser(url);
  }

  if (Tiny.isArray(name)) {
    name.forEach(function(item, i) {
      let s;
      if (item.url) {
        s = com.audioUrlParser(item.url);
        s && (name[i].url = s);
      } else {
        s = com.audioUrlParser(item);
        s && (name[i] = s);
      }
    });
  }

  return baseAdd.call(this, name, url, options, cb);
};

// 覆盖 Loader
if (Tiny.Loader) {
  Tiny.Loader = loader ? new loader() : null; // eslint-disable-line
}

/**
 * 为了方便和性能优化，Tiny 将 AudioManager 实例化出来，你可以通过 `Tiny.audio.manager` 直接使用
 *
 * @example
 *
 * var audio = Tiny.audio.manager.getAudio('...');
 * audio.play();
 *
 * @name manager
 * @type {Tiny.audio.manager}
 * @static
 */
const manager = new com.AudioManager();
export {
  com,
  manager,
};
