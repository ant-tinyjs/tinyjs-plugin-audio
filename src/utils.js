const Resource = Tiny.loaders.Resource;

const isHTMLAudioSupported = !!window.Audio;
const webAudioContext = window.AudioContext || window.webkitAudioContext;
const isWebAudioSupported = window.disableWebAudio === true ? false : !!webAudioContext;
const isAudioSupported = isWebAudioSupported || isHTMLAudioSupported;
let isMp3Supported = false;
let isOggSupported = false;
let isWavSupported = false;
let isM4aSupported = false;
let createGainNode = null;
let globalWebAudioContext = isWebAudioSupported ? new webAudioContext() : null; // eslint-disable-line

if (isAudioSupported) {
  const audio = document.createElement('audio');
  isMp3Supported = audio.canPlayType('audio/mpeg;') !== '';
  isOggSupported = audio.canPlayType('audio/ogg; codecs="vorbis"') !== '';
  isWavSupported = audio.canPlayType('audio/wav') !== '';
  isM4aSupported = audio.canPlayType('audio/mp4; codecs="mp4a.40.5"') !== '';

  //Add some config to the pixi loader
  if (isMp3Supported) _setAudioExt('mp3');
  if (isOggSupported) _setAudioExt('ogg');
  if (isWavSupported) _setAudioExt('wav');
  if (isM4aSupported) _setAudioExt('m4a');

  if (isWebAudioSupported) {
    createGainNode = function createGainNode() {
      return globalWebAudioContext.createGain ? globalWebAudioContext.createGain() : globalWebAudioContext.createGainNode();
    };
  }
}

function _setAudioExt(ext) {
  if (isWebAudioSupported) {
    // fixed
    delete Resource._loadTypeMap['mp3'];
    delete Resource._loadTypeMap['ogg'];
    delete Resource._loadTypeMap['wav'];
    Resource._xhrTypeMap['mp3'] = Resource.XHR_RESPONSE_TYPE.BUFFER;
    Resource._xhrTypeMap['ogg'] = Resource.XHR_RESPONSE_TYPE.BUFFER;
    Resource._xhrTypeMap['wav'] = Resource.XHR_RESPONSE_TYPE.BUFFER;
    Resource.setExtensionXhrType(ext, Resource.XHR_RESPONSE_TYPE.BUFFER);
  } else {
    Resource.setExtensionLoadType(ext, Resource.LOAD_TYPE.AUDIO);
  }
}

export default {
  isHTMLAudioSupported,
  webAudioContext,
  isWebAudioSupported,
  isAudioSupported,
  isMp3Supported,
  isOggSupported,
  isWavSupported,
  isM4aSupported,
  globalWebAudioContext,
  createGainNode,
};
