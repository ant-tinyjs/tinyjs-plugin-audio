import utils from './utils';

/**
 * 音频分析器
 *
 * @class
 */

class AudioAnalyser {
  /**
   *
   * @param {Audio}  TinyAudio对象    音频对象
   * @param {fftSize} fftSize 快速傅里叶变换数据量(数据量的大小根据频谱分析的需要，一般为2的n次方，如512，1024，2048，4096等)
   */
  constructor(audio, fftSize) {
    if (utils.isWebAudioSupported) {
      this.analyser = audio.context.createAnalyser();
      this.analyser.fftSize = fftSize || 2048;
      this.data = new Uint8Array(this.analyser.frequencyBinCount);

      audio.gainNode.connect(this.analyser);
    } else {
      console.warn('not support web audio api. the data will return empty array or zero.');
    }
  }

  /**
   * 获取频域数据
   *
   * @return {Array}
   */
  getFrequencyData() {
    utils.isWebAudioSupported && this.analyser.getByteFrequencyData(this.data);

    return this.data || [];
  };

  /**
   * 获取频域数据平均数
   *
   * @return {number}
   */
  getAverageFrequency() {
    let value = 0;
    const data = this.getFrequencyData();

    if (utils.isWebAudioSupported) {
      for (let i = 0; i < data.length; i++) {
        value += data[i];
      }
    }

    return (value / data.length) || 0;
  };
}

export default AudioAnalyser;
