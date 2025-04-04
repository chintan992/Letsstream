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
  videasy: {
    name: 'Videasy',
    quality: 'HD',
  },
  vidsrc2: {
    name: 'VidSrc V2',
    quality: 'HD',
  },
  vidsrc3: {
    name: 'VidSrc V3',
    quality: 'HD',
  },
  vidfast: {
    name: 'Vidfast',
    quality: 'HD',
  },
  turbovid: {
    name: 'TurboVid',
    quality: 'HD',
  },
  vidbinge: {
    name: 'Vidbinge',
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
    case 'multiembed':
      return type === 'series'
        ? `https://vidlink.pro/tv/${seriesId}/${season}/${episodeNo}?autoplay=true&title=true`
        : `https://vidlink.pro/movie/${movieId}?autoplay=true&title=true`;
    case 'autoembed':
      baseUrl = 'https://player.autoembed.cc/embed/';
      return type === 'series'
        ? `${baseUrl}tv/${seriesId}/${season}/${episodeNo}${antiPopupParams.autoembed}?autoplay=true`
        : `${baseUrl}movie/${movieId}${antiPopupParams.autoembed}?autoplay=true`;
    case '2embed':
      return type === 'series'
        ? `https://www.2embed.cc/embed/tv/${seriesId}&s=${season}&e=${episodeNo}${antiPopupParams['2embed']}`
        : `https://www.2embed.cc/embed/${movieId}${antiPopupParams['2embed']}`;
    case 'newMultiembed':
      return type === 'series'
        ? `https://multiembed.mov/?video_id=${seriesId}&tmdb=1&s=${season}&e=${episodeNo}`
        : `https://multiembed.mov/?video_id=${movieId}&tmdb=1`;
    case 'new2embed':
      return type === 'series'
        ? `https://2embed.org/embed/tv/${seriesId}/${season}/${episodeNo}`
        : `https://2embed.org/embed/movie/${movieId}`;
    case 'newAutoembed':
      return type === 'series'
        ? `https://autoembed.co/tv/tmdb/${movieId}-${season}-${episodeNo}`
        : `https://autoembed.co/movie/tmdb/${movieId}`;
    case 'vidsrc':
      return type === 'series'
        ? `https://vidsrc.xyz/embed/tv?tmdb=${seriesId}&season=${season}&episodeNo=${episodeNo}&ds_lang=en`
        : `https://vidsrc.xyz/embed/movie?tmdb=${movieId}&ds_lang=en`;
    case 'moviesClub':
      return type === 'series'
        ? `https://moviesapi.club/tv/${seriesId}-${season}-${episodeNo}`
        : `https://moviesapi.club/movie/${movieId}`;
    case 'notonGo':
      return type === 'series'
        ? `https://www.NontonGo.win/embed/tv/${seriesId}/${season}/${episodeNo}`
        : `https://www.NontonGo.win/embed/movie/${movieId}`;
    case '111movies':
      return type === 'series'
        ? `https://111movies.com/tv/${seriesId}/${season}/${episodeNo}`
        : `https://111movies.com/movie/${movieId}`;
    case 'flickyhost':
      return type === 'series'
        ? `https://flicky.host/embed/tv/?id=${seriesId}/${season}/${episodeNo}`
        : `https://flicky.host/embed/movie/?id=${movieId}`;
    case 'vidjoyPro':
      return type === 'series'
        ? `https://vidjoy.pro/embed/tv/${seriesId}/${season}/${episodeNo}`
        : `https://vidjoy.pro/embed/movie/${movieId}`;
    case 'embedSU':
      return type === 'series'
        ? `https://embed.su/embed/tv/${seriesId}/${season}/${episodeNo}`
        : `https://embed.su/embed/movie/${movieId}`;
    case 'primeWire':
      return type === 'series'
        ? `https://www.primewire.tf/embed/tv?tmdb=${seriesId}&season=${season}&episode=${episodeNo}`
        : `https://www.primewire.tf/embed/movie?tmdb=${movieId}`;
    case 'smashyStream':
      return type === 'series'
        ? `https://embed.smashystream.com/playere.php?tmdb=${seriesId}&season=${season}&episode=${episodeNo}`
        : `https://embed.smashystream.com/playere.php?tmdb=${movieId}`;
    case 'vidStream':
      return type === 'series'
        ? `https://vidstream.site/embed/tv/${seriesId}/${episodeNo}`
        : `https://vidstream.site/embed(movie/${movieId}`;
    case 'videasy':
      return type === 'series'
        ? `https://player.videasy.net/tv/${seriesId}/${season}/${episodeNo}`
        : `https://player.videasy.net/movie/${movieId}`;
    case 'vidsrc2':
      return type === 'series'
        ? `https://vidsrc.wtf/api/2/tv/?id=${seriesId}&s=${season}&e=${episodeNo}`
        : `https://vidsrc.wtf/api/2/movie/?id=${movieId}`;
    case 'vidsrc3':
      return type === 'series'
        ? `https://vidsrc.wtf/api/3/tv/?id=${seriesId}&s=${season}&e=${episodeNo}`
        : `https://vidsrc.wtf/api/3/movie/?id=${movieId}`;
    case 'vidfast':
      return type === 'series'
        ? `https://vidfast.pro/tv/${seriesId}/${season}/${episodeNo}?autoPlay=true`
        : `https://vidfast.pro/movie/${movieId}?autoPlay=true`;
    case 'turbovid':
      return type === 'series'
        ? `https://turbovid.eu/api/req/tv/${seriesId}/${season}/${episodeNo}`
        : `https://turbovid.eu/api/req/movie/${movieId}`;
    case 'vidbinge':
      return type === 'series'
        ? `https://vidbinge.dev/embed/tv/${seriesId}/${season}/${episodeNo}`
        : `https://vidbinge.dev/embed/movie/${movieId}`;
    default:
      return '';
  }
};

export { getIframeSrc, VIDEO_SOURCES };