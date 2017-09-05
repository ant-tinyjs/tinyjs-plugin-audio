import {com} from './index';
import Audio from './Audio';

/**
 * 音效管理类
 *
 * @class
 */
class AudioManager {

  constructor() {
    /**
     * 实例化之后的音效集合
     *
     * @member {array}
     */
    this.sounds = [];
  }

  /**
   * 获取音效实例
   *
   * @param {string} name
   * @return {Tiny.audio.com.Audio}
   */
  getAudio(name) {
    const audio = new Audio(AudioManager.audios[com.audioUrlParser(name) || name], this);
    this.sounds.push(audio);
    return audio;
  }

  /**
   * 从音效集合 `sounds` 中移除某个音效的实例化对象
   *
   * @param {Tiny.audio.com.Audio} audio
   */
  removeAudio(audio) {
    const index = this.sounds.indexOf(audio);
    if (index !== -1) {
      this.sounds.splice(index, 1);
    }
  }

  /**
   * 暂停所有音效，入参是 `false` 就播放所有音效
   * @param {boolean} value
   */
  pause(value) {
    value = (value !== false);

    this.sounds.forEach((item) => {
      if (!value && item._paused) {
        item.play();

        return true;
      }

      item.playing && item.pause();
    });
  }

  /**
   * 恢复所有音效播放
   */
  resume() {
    return this.pause(false);
  }

}

/**
 * 存储所有加载的音效 `AudioBuffer` 或 `HTMLAudioElement`
 *
 * @static
 * @type {object}
 */
AudioManager.audios = {};

export default AudioManager;
