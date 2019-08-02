export default ({ app, store }) => {
  const onDeviceReady = () => {
    store.dispatch('controllers/start_ble_scan')
  }
  document.addEventListener("deviceready", onDeviceReady, false);
}
