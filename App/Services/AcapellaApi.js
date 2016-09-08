import apisauce from 'apisauce'

const create = (baseURL = 'http://vaas.acapella-group.com') => {
  const api = apisauce.create({ baseURL })

  const getAudioMsg = (msg, msgVoice) => {
    api.setHeaders({
      prot_vers: 2,
      cl_login: 'EVAL_VAAS',
      cl_app: 'EVAL_6615982',
      cl_pwd: 'ytjsg3bj',
      req_voice: `${msgVoice}`,
      req_text: `${msg}`,
      req_snd_type: 'OGG'
    })
    return api.post('/Services/UrlMaker?json')
  }

  return {
    getAudioMsg
  }
}

export default { create }
