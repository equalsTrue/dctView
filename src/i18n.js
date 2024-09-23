import Vue from 'vue'
import VueI18n from 'vue-i18n'
import elementEnLocale from 'element-ui/lib/locale/lang/en' // element-ui lang
import elementZhLocale from 'element-ui/lib/locale/lang/zh-CN'// element-ui lang
Vue.use(VueI18n)

function loadLocaleMessages() {
  const locales = require.context('./lang', true, /[A-Za-z0-9-_,\s]+\.json$/i)
  const messages = {
    en: {
      ...elementEnLocale
    },
    cn: {
      ...elementZhLocale
    }
  }
  locales.keys().forEach(key => {
    const matched = key.match(/([A-Za-z0-9-_]+)\./i)
    if (matched && matched.length > 1) {
      const locale = matched[1]
      messages[locale] = Object.assign(messages[locale], locales(key))
    }
  })
  return messages
}

export default new VueI18n({
  locale: process.env.VUE_APP_I18N_LOCALE || 'cn',
  fallbackLocale: process.env.VUE_APP_I18N_FALLBACK_LOCALE || 'cn',
  messages: loadLocaleMessages()
})
