<!--
      Copyright (C) 2019  SuperGreenLab <towelie@supergreenlab.com>
      Author: Constantin Clauzel <constantin.clauzel@gmail.com>

      This program is free software: you can redistribute it and/or modify
      it under the terms of the GNU General Public License as published by
      the Free Software Foundation, either version 3 of the License, or
      (at your option) any later version.

      This program is distributed in the hope that it will be useful,
      but WITHOUT ANY WARRANTY; without even the implied warranty of
      MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
      GNU General Public License for more details.

      You should have received a copy of the GNU General Public License
      along with this program.  If not, see <http://www.gnu.org/licenses/>.
 -->

<template>
  <section :id='$style.container'>
    <a href='javascript:void(0)' @click='openCamera'>Open camera</a>
  </section>
</template>

<script>
import axios from 'axios'

export default {
  components: {},
  methods: {
    openCamera() {
      const options = {
        quality: 50,
        destinationType: Camera.DestinationType.FILE_URI,
        sourceType: Camera.PictureSourceType.CAMERA,
        encodingType: Camera.EncodingType.JPEG,
        mediaType: Camera.MediaType.ALLMEDIA,
        allowEdit: false,
        correctOrientation: true
      }
      const takePic = () => {
        navigator.camera.getPicture((imageUri) => {
          window.resolveLocalFileSystemURL(imageUri, function success(fileEntry) {
            console.log("got file: " + fileEntry.fullPath);
            fileEntry.file((file) => {
              console.log('file', file)
              const reader = new FileReader()
              reader.onload = async (e) => {
                const formData = new FormData()
                formData.append('pic', new Blob([reader.result]), 'pic.png')
                formData.append('text', 'Hello World!')
                try {
                  await axios.post('https://discord.supergreenlab.com', formData, {
                    headers: {
                      'Content-Type': `multipart/form-data; boundary=${formData._boundary}`
                    }
                  })
                } catch(e) {
                  console.log(e)
                }
              }
              reader.readAsArrayBuffer(file)
            }, console.log)
          }, console.log);
        }, function cameraError(error) {
          console.debug("Unable to obtain picture: " + error, "app");
        }, options);
      }
      if (device.platform == 'Android') {
        const permissions = cordova.plugins.permissions;
        permissions.requestPermission(permissions.WRITE_EXTERNAL_STORAGE,
          (status) => {
            if (status.hasPermission) {
              takePic()
            }
          }
        )
      } else {
        takePic()
      }
    },
  },
}

</script>

<style module lang=stylus>

#container
  flex: 1
  display: flex
  align-items: center
  justify-content: center
  position: relative
  overflow-y: auto
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  background-color: white
  margin: 0pt 5pt 0 10pt
  max-width: 700pt
  min-height: 100vh

  @media screen and (max-width: 600px)
    width: 100vw
    margin: 0pt 0pt 0 0pt
    padding-top: 40pt

</style>
