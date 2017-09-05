import utils from './utils';
import AudioManager from './AudioManager';

const _allowedExt = ['ogg', 'mp3'];
const _mimeTypes = {
  mp3: 'audio/mpeg',
  mp4: 'audio/mp4',
  ogg: 'audio/ogg; codecs="vorbis"',
  m4a: 'audio/x-m4a',
  wav: 'audio/wav; codecs="1"',
};

export function audioParser() {
  return function (resource, next) {
    if (!utils.isAudioSupported || !resource.data) return next();

    const ext = _getExt(resource.url);
    if (_allowedExt.indexOf(ext) === -1 || !_canPlay(ext)) return next();

    const name = resource.name || resource.url;
    if (utils.isWebAudioSupported) {
      utils.globalWebAudioContext.decodeAudioData(resource.data, (buffer) => {
        AudioManager.audios[name] = buffer;
        next();
      });
    } else {
      AudioManager.audios[name] = resource.data;
      return next();
    }
  };
}

export function audioUrlParser(resourceUrl) {
  let url;
  if (!Tiny.isArray(resourceUrl)) {
    const arr = [];
    arr.push(resourceUrl);
    resourceUrl = arr;
  }
  for (let i = 0; i < resourceUrl.length; i++) {
    const ext = _getExt(resourceUrl[i]);
    if (_allowedExt.indexOf(ext) !== -1) {
      if (_canPlay(ext)) {
        url = resourceUrl[i];
      } else {
        url = resourceUrl[i].replace(/\.[^\.\/\?\\]*(\?.*)?$/, '.' + _getCanPlayExtension()); // eslint-disable-line
      }
    }
  }
  return url;
}

function _getExt(url) {
  return url.split('?').shift().split('.').pop().toLowerCase();
}

function _canPlay(ext) {
  let canPlay = false;
  switch (ext) {
    case 'm4a':
      canPlay = utils.isM4aSupported;
      break;
    case 'mp3':
      canPlay = utils.isMp3Supported;
      break;
    case 'ogg':
      canPlay = utils.isOggSupported;
      break;
    case 'wav':
      canPlay = utils.isWavSupported;
      break;
  }

  return canPlay;
}

function _getCanPlayExtension() {
  const audio = new Audio();
  return Tiny.detect(_allowedExt,
    function (extension) {
      return audio.canPlayType(_mimeTypes[extension]) ? extension : null;
    });
}
