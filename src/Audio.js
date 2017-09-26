import utils from './utils';

/**
 * 音效类
 *
 * @class
 * @extends Tiny.EventEmitter
 */
class Audio extends Tiny.EventEmitter {
  /**
   *
   * @param {AudioBuffer|HTMLAudioElement}  data    音效数据
   * @param {Tiny.audio.manager}       manager 音效管理对象
   */
  constructor(data, manager) {
    super();

    /**
     * 音效管理对象
     *
     * @member {Tiny.audio.manager}
     */
    this.manager = manager;

    /**
     * 音效数据
     * @member {AudioBuffer|HTMLAudioElement}
     */
    this.data = data;

    if (!utils.isWebAudioSupported) {
      this.audio = new window.Audio();
      this.audio.addEventListener('ended', this._onEnd.bind(this));
      this.audio.src = this.data.children[0].src;
      this.audio.preload = 'auto';
      this.audio.load();
    } else {
      this.context = utils.globalWebAudioContext;
      this.gainNode = utils.createGainNode();
    }

    this.reset();
  }

  /**
   * 播放音效
   *
   * @return {Tiny.audio.com.Audio}
   */
  play() {
    if (this.playing) return this;

    this.playing = true;
    this.emit('play');

    if (utils.isWebAudioSupported) {
      // 创建AudioBufferNode
      this.source = this.context.createBufferSource();

      // 兼容浏览器处理start和stop方法
      this.source.start = this.source.start || this.source.noteOn;
      this.source.stop = this.source.stop || this.source.noteOff;

      // 设置是否循环
      this.source.loop = this.loop;

      // 监听音频onended事件
      this.source.onended = this._onEnd.bind(this);

      this._startTime = this.context.currentTime;

      // 将音频源链接到gainNode音频处理节点（gainNode接口表示音量变更，调节音量。）
      this.source.connect(this.gainNode);

      // 将gainNode连接到硬件设备
      this.gainNode.connect(this.context.destination);

      // 设置音频源buffer数据
      this.source.buffer = this.data;

      // 播放音频数据
      this.source.start(0, this._paused ? this._lastPauseTime : 0);
    } else {
      this.audio.play();
    }

    return this;
  }

  /**
   * 停止播放音效(音乐播放时间归零)
   *
   * @return {Tiny.audio.com.Audio}
   */
  stop() {
    this.emit('stop');

    if (utils.isWebAudioSupported) {
      this.source.stop(0);
      this._paused = false;
      this._startTime = this.context.currentTime;
    } else {
      this.audio.pause();
      this.audio.currentTime = 0;
    }
    this.playing = false;
    this._paused = false;
    this.reset();

    return this;
  }

  /**
   * 暂停播放音乐(再次播放从暂停点开始)
   *
   * @return {Tiny.audio.com.Audio}
   */
  pause() {
    if (!this.playing) return this;

    this.emit('pause');
    if (utils.isWebAudioSupported) {
      this._offsetTime += this.context.currentTime - this._startTime;
      this._lastPauseTime = (this._offsetTime % this.data.duration);
      this.source.stop(0);
    } else {
      this.audio.pause();
    }
    this.playing = false;
    this._paused = true;

    return this;
  }

  /**
   * 重置音效
   */
  reset() {
    this._startTime = 0;
    this._lastPauseTime = 0;
    this._offsetTime = 0;
    this.playing = false;
    this._paused = false;
    if (utils.isWebAudioSupported) {
      this.audio = null;
    }
  }

  /**
   * 将自己从 `Tiny.audio.manager` 的实例对象中移除
   */
  remove() {
    this.manager.removeAudio(this);
  }

  _onEnd() {
    if (!utils.isWebAudioSupported) {
      if (this.loop) {
        this.audio.currentTime = 0;
        this.audio.play();
      } else {
        this.reset();
        this.emit('end');
      }
    } else {
      if (!this._paused) {
        this.reset();
        this.emit('end');
      }
    }
  }

  /**
   * 是否循环播放
   *
   * @member {Tiny.audio.com.Audio}
   * @default false
   */
  get loop() {
    return this._loop;
  }

  set loop(value) {
    if (value === this._loop) return;
    this._loop = value;
    if (utils.isWebAudioSupported && this.audio) {
      this.audio.loop = value;
    }
  }

  /**
   * 音频音量调节
   * @value {number} range(0, 1)
   * @member {Tiny.audio.com.Audio}
   * @default 1
   */
  get volume() {
    return utils.isWebAudioSupported ? this.gainNode.gain.value : this.audio.volume;
  }

  set volume(value) {
    if (utils.isWebAudioSupported) {
      this.gainNode.gain.value = value;
    } else {
      this.audio.volume = value;
    }
  }
}

Audio.prototype._loop = false;
Audio.prototype._paused = false;
Audio.prototype._startTime = 0;
Audio.prototype._lastPauseTime = 0;
Audio.prototype._offsetTime = 0;

/**
 * 音效是否正在播放
 *
 * @member {boolean}
 * @readonly
 */
Audio.prototype.playing = false;

export default Audio;
