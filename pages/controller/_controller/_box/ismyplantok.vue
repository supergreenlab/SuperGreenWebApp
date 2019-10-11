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
    <div v-if='file' :id='$style.review'>
      <div :id='$style.preview' :style='{"background-image": `url(${imageUri ? imageUri : file})`}'></div>
      <div :id='$style.form'>
        <textarea :id='$style.text' v-model='text' placeholder='ex: Why does my plant ... ?'></textarea>
        <a :id='$style.button' href='javascript:void(0)' @click='upload'>Upload</a>
      </div>
    </div>
    <div v-else-if='!file && mobile'>
      <a href='javascript:void(0)' @click='openCamera'>Open camera</a>
    </div>
    <div v-else-if='!file && !mobile'>
      <input type='file' @change='fileField' accept='image/*' />
    </div>
  </section>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      file: null,
      imageUri: null,
      text: '',
      mobile: document.URL.indexOf('http://') === -1 && document.URL.indexOf('https://') === -1,
      uploading: false,
      error: false,
    }
  },
  components: {},
  methods: {
    async upload() {
      const formData = new FormData()
      formData.append('pic', new Blob([this.$data.file]), 'pic.png')
      formData.append('text', this.$data.text)
      this.$data.uploading = true
      try {
        await axios.post('https://discord.supergreenlab.com', formData, {
          headers: {
            'Content-Type': `multipart/form-data; boundary=${formData._boundary}`
          }
        })
        this.$data.file = null
      } catch(e) {
        console.log(e)
      }
      this.$data.uploading = false
    },
    fileField(e) {
      if (e.target.files && e.target.files[0]) {
        const reader = new FileReader();

        reader.onload = (e) => {
          this.$data.file = reader.result
        }

        reader.readAsDataURL(e.target.files[0]);
      }
    },
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
          window.resolveLocalFileSystemURL(imageUri, (fileEntry) => {
            console.log("got file: " + fileEntry.fullPath);
            fileEntry.file((file) => {
              console.log('file', file)
              const reader = new FileReader()
              reader.onload = async (e) => {
                this.$data.file = reader.result
                this.$data.imageUri = imageUri
              }
              reader.readAsArrayBuffer(file)
            }, console.log)
          }, console.log);
        }, (error) => {
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
  height: 100%

  @media screen and (max-width: 600px)
    height: auto
    width: 100vw
    margin: 0pt 0pt 0 0pt
    padding-top: 40pt

#review
  display: flex
  flex-direction: column
  width: 100%
  height: 100%

#preview
  flex: 3
  margin: 10pt
  background-size: contain
  background-repeat: no-repeat
  background-position: center

#form
  display: flex
  width: 100%
  flex: 1

#text
  flex: 1
  border: 1px solid #ababab
  border-radius: 5pt
  padding: 5pt
  
#button
  display: flex
  align-items: center
  justify-content: center
  padding: 0 5pt
  background-color: #3BB30B
  height: 100%
  color: white
  text-decoration: none
  border-radius: 3pt

#button:hover
  background-color: #4BC30B

#button:active
  background-color: #2BA30B

</style>
