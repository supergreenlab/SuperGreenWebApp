export default ({ app }) => {
  console.log('plugins/cordova.js')
  const onDeviceReady = () => {
    console.log('onDeviceReady')
  }
  document.addEventListener("deviceready", onDeviceReady, false);
}
