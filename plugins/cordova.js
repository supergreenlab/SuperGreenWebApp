export default ({ app, store }) => {
  const onDeviceReady = () => {
    store.dispatch('controllers/initCordova')
    window.open = cordova.InAppBrowser.open
  }
  document.addEventListener("deviceready", onDeviceReady, false);
}
