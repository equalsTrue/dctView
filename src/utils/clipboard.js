import Vue from 'vue'
import Clipboard from 'clipboard'

function clipboardSuccess(msg) {
  msg = msg !== null && msg !== undefined && msg.length > 0 ? msg : 'Copy successfully'
  Vue.prototype.$message({
    message: msg,
    type: 'success',
    duration: 1500
  })
}

function clipboardError(msg) {
  msg = msg !== null && msg !== undefined && msg.length > 0 ? msg : 'Copy failed'
  Vue.prototype.$message({
    message: msg,
    type: 'error'
  })
}

export default function handleClipboard(text, event, message) {
  let successMsg = null
  let errorMsg = null
  if (message !== null && message !== undefined) {
    successMsg = message.success
    errorMsg = message.error
  }
  const clipboard = new Clipboard(event.target, {
    text: () => text
  })
  clipboard.on('success', () => {
    clipboardSuccess(successMsg)
    clipboard.off('error')
    clipboard.off('success')
    clipboard.destroy()
  })
  clipboard.on('error', () => {
    clipboardError(errorMsg)
    clipboard.off('error')
    clipboard.off('success')
    clipboard.destroy()
  })
  clipboard.onClick(event)
}
