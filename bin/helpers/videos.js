const youtubeUrl = /(https|http)(:\/\/)(www\.|m\.)?(youtu(be)?)(\.com|\.be)?\/((watch|w)(\?v=)|v\/|)(-?)([aA-zZ0-9?=&]*)/
const vimeoUrl = /(https|http)(:\/\/)(www\.|m\.)?(vimeo)(\.com|)\/([aA-zZ0-9?=&]*)/
const dailymotionUrl = /(https|http)(:\/\/)(www\.|m\.)?(dailymotion)(\.com|)\/(video)\/([aA-zZ0-9?=&]*)/
const twitchUrl = /(https|http)(:\/\/)(www\.|m\.)?(twitch)(\.tv)\/([aA-zZ0-9?=&\/]*)/


module.exports = function(givenUrl) {
  let url = givenUrl
  let platform = ''
  let embed = ''
  
  if (url.match(youtubeUrl)) platform = 'youtube'
  else if (url.match(vimeoUrl)) platform = 'vimeo'
  else if (url.match(dailymotionUrl)) platform = 'dailymotion'
  else if (url.match(twitchUrl)) platform = 'twitch'
  else platform = ''

  switch (platform) {
    case 'youtube':
      embed = `<iframe width="420" height="315" src="https://www.youtube.com/embed/${url.match(youtubeUrl)[11]}"></iframe>`
      break
    
    case 'vimeo':
      embed = `<iframe src="https://player.vimeo.com/video/${url.match(vimeoUrl)[6]}" width="640" height="360" frameborder="0"></iframe>`  
      break

    case 'dailymotion':
      embed = `<iframe frameborder="0" width="480" height="270" src="//www.dailymotion.com/embed/video/${url.match(dailymotionUrl[7])}"></iframe>`
      break

    case 'twitch':
      embed = `<iframe src="http://player.twitch.tv/?${url.match(twitchUrl)[6]}" height="420" width="315" frameborder="0"></iframe>`
      break

    default:
      embed = ''
      break;
  }

  return embed
}
