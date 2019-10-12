export default ({ app, store }) => {
  const onDeviceReady = () => {
    store.dispatch('controllers/init_cordova')
    window.open = cordova.InAppBrowser.open
  }
  document.addEventListener("deviceready", onDeviceReady, false);
}
