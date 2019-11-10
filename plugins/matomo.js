export default ({ app }) => {
  const uuidv4 = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
  window.onload = () => {
    let sglid = window.localStorage.getItem('sglid')
    if (!sglid) {
      sglid = uuidv4()
      window.localStorage.setItem('sglid')
    }
    app.$matomo && app.$matomo.setUserId(sglid)
  }
}
