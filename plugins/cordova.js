export default ({ app, store }) => {
  const onDeviceReady = () => {
    store.dispatch('controllers/init_cordova')
  }
  document.addEventListener("deviceready", onDeviceReady, false);
}
