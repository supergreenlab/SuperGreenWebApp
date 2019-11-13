export default ({ app, store }) => {
  const onDeviceReady = () => {
    store.dispatch('zeroconf/init')
    store.dispatch('ble/init')
    window.open = cordova.InAppBrowser.open
  }
  document.addEventListener("deviceready", onDeviceReady, false);
}
