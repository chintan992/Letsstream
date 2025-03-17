// src/api.js

const VIDEO_SOURCES = {
  multiembed: {
    name: 'Vidlink',
    quality: 'LESS ADS AUTOPLAY',
  },
  autoembed: {
    name: 'AutoEmbed',
    quality: 'AUTOPLAY',
  },
  '2embed': {
    name: '2Embed',
    quality: 'LESS ADS',
  },
  newMultiembed: {
    name: 'MultiEmbed',
    quality: 'Full HD',
  },
  new2embed: {
    name: '2Embed.org',
    quality: 'HD',
  },
  newAutoembed: {
    name: 'AutoEmbed.co',
    quality: 'Full HD',
  },
  vidsrc: {
    name: 'VidSrc',
    quality: 'LESS ADS',
  },
  moviesClub: {
    name: 'MoviesAPI',
    quality: 'WORKING with ADS',
  },
  notonGo: {
    name: 'NontonGo',
    quality: 'HD',
  },
  '111movies': {
    name: '111Movies',
    quality: 'HD',
  },
  flickyhost: {
    name: 'FlickyHost',
    quality: 'HINDI',
  },
  vidjoyPro: {
    name: 'Vidjoy Pro',
    quality: 'HD LESS ADS',
  },
  embedSU: {
    name: 'EmbedSU',
    quality: 'HD',
  },
  primeWire: {
    name: 'PrimeWire',
    quality: 'HD',
  },
  smashyStream: {
    name: 'SmashyStream',
    quality: 'HD',
  },
  vidStream: {
    name: 'VidStream',
    quality: 'HD',
  },
  // New video sources added below
  videasy: {
    name: 'Videasy',
    quality: 'AUTOPLAY',
  },
  vidsrcWtfV1: {
    name: 'vidsrc.wtf V1',
    quality: 'HD',
  },
  vidsrcWtfV2: {
    name: 'vidsrc.wtf V2',
    quality: 'HD',
  },
  vidsrcWtfV3: {
    name: 'vidsrc.wtf V3',
    quality: 'HD',
  },
  vidfastPro: {
    name: 'Vidfast.pro',
    quality: 'AUTOPLAY',
  },
  turbovidEu: {
    name: 'TurboVid.eu',
    quality: 'HD',
  },
  vidbingeDev: {
    name: 'Vidbinge.dev',
    quality: 'HD',
  },
};

const getIframeSrc = (mediaData) => {
  const { type, apiType, seriesId, season, episodeNo, movieId } = mediaData;
  let baseUrl = '';

  // Anti-popup parameters for different providers
  const antiPopupParams = {
    multiembed: '&popups=0&block_popups=1',
    autoembed: '?block_popups=1',
    '2embed': '?popups=0',
    vidsrc: '&block_popups=1'
  };

  switch (apiType) {
    // Existing cases...
    case 'multiembed':
      return type === 'series'
        ? `https://vidlink.pro/tv/${seriesId}/${season}/${episodeNo}?autoplay=true&title=true`
        : `https://vidlink.pro/movie/${movieId}?autoplay=true&title=true`;
    case 'autoembed':
      baseUrl = 'https://player.autoembed.cc/embed/';
      return type === 'series'
        ? `${baseUrl}tv/${seriesId}/${season}/${episodeNo}${antiPopupParams.autoembed}?autoplay=true`
        : `${baseUrl}movie/${movieId}${antiPopupParams.autoembed}?autoplay=true`;
    // Other existing cases...

    // New cases for additional sources
    case 'videasy':
      return type === 'series'
        ? `https://player.videasy.net/tv/${seriesId}/${season}/${episodeNo}`
        : `https://player.videasy.net/movie/${movieId}`;
    case 'vidsrcWtfV1':
      return type === 'series'
        ? `https://vidsrc.wtf/api/1/tv/?id=${seriesId}&s=${season}&e=${episodeNo}`
        : `https://vidsrc.wtf/api/1/movie/?id=${movieId}`;
    case 'vidsrcWtfV2':
      return type === 'series'
        ? `https://vidsrc.wtf/api/2/tv/?id=${seriesId}&s=${season}&e=${episodeNo}`
        : `https://vidsrc.wtf/api/2/movie/?id=${movieId}`;
    case 'vidsrcWtfV3':
      return type === 'series'
        ? `https://vidsrc.wtf/api/3/tv/?id=${seriesId}&s=${season}&e=${episodeNo}`
        : `https://vidsrc.wtf/api/3/movie/?id=${movieId}`;
    case 'vidfastPro':
      return type === 'series'
        ? `https://vidfast.pro/tv/${seriesId}/${season}/${episodeNo}?autoPlay=true`
        : `https://vidfast.pro/movie/${movieId}?autoPlay=true`;
    case 'turbovidEu':
      return type === 'series'
        ? `https://turbovid.eu/api/req/tv/${seriesId}/${season}/${episodeNo}`
        : `https://turbovid.eu/api/req/movie/${movieId}`;
    case 'vidbingeDev':
      return type === 'series'
        ? `https://vidbinge.dev/embed/tv/${seriesId}/${season}/${episodeNo}`
        : `https://vidbinge.dev/embed/movie/${movieId}`;
    default:
      return '';
  }
};

export { getIframeSrc, VIDEO_SOURCES };