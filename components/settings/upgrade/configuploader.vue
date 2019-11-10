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
    <Title title='CONFIG/ADMIN UPGRADER' icon='upgrade.svg' />
    <div :id='$style.body'>
      <div>
        <div><h1>1</h1>Download config from internet</div>
        <a href='javascript:void(0)' :class='$style.button' @click='download'>
          Download new config
        </a>
        <div v-if='downloading'>Downloading config</div>
        <div v-else-if='downloaded'>Config downloaded</div>
      </div>
      <div>
        <div><h1>2</h1>Upload config to controller</div>
        <a href='javascript:void(0)' :class='$style.button' @click='upload'>
          Upload new config
        </a>
        <div v-if='uploading'>Uploading config</div>
        <div v-else-if='uploaded'>Config uploaded</div>
      </div>
    </div>
  </section>
</template>

<script>
import axios from 'axios'
import Title from '~/components/settings/common/settings-title.vue'

export default {
  data() {
    return {
      downloaded: false,
      downloading: false,
      uploaded: false,
      uploading: false,
    }
  },
  components: {Title,},
  computed: {
    controller() {
      return this.$store.getters['controllers/getSelected']
    },
  },
  methods: {
    async download() {
      const controller = this.controller
      this.$data.downloading = true
      try {
        const { data: last_timestamp } = await axios.get(`http://update.supergreenlab.com${controller.ota_basedir.value}/last_timestamp`, {responseType: 'text', headers: {'Accept': 'application/octet-stream'}})
        const { data: config } = await axios.get(`http://update.supergreenlab.com${controller.ota_basedir.value}/${last_timestamp}/html_app/config.json`, {responseType: 'arraybuffer', headers: {'Accept': 'application/octet-stream'}})
        this.config = config
        const { data: htmlapp } = await axios.get(`http://update.supergreenlab.com${controller.ota_basedir.value}/${last_timestamp}/html_app/app.html`, {responseType: 'arraybuffer', headers: {'Accept': 'application/octet-stream'}})
        this.htmlapp = htmlapp
        this.$data.downloaded = true
      } catch(e) {
        console.log(e)
      }
      this.$data.downloading = false
    },
    async upload() {
      if (!this.config || !this.htmlapp) return
      const controller = this.controller
      this.$data.uploading = true
      try {
        await axios.post(`http://${controller.wifi_ip.value}/fs/config.json`, this.config)
        await axios.post(`http://${controller.wifi_ip.value}/fs/app.html`, this.htmlapp)
        this.$data.uploaded = true
      } catch(e) {
        console.log(e)
      }
      this.$data.uploading = false
    },
  },
}
</script>

<style module lang=stylus>

#container
  display: flex
  flex-direction: column
  padding: 0 10pt

#body
  display: flex
  align-items: center
  justify-content: space-around
  padding: 10pt 25pt
  color: #717171
  @media screen and (max-width: 600px)
    justify-content: center
    flex-direction: column

.button
  display: flex
  align-items: center
  justify-content: center
  padding: 0 25pt
  background-color: #3BB30B
  height: 23pt
  color: white
  text-decoration: none
  border-radius: 3pt
  margin: 10pt 0

.button:hover
  background-color: #4BC30B

.button:active
  background-color: #2BA30B

.invalid
  opacity: 0.5

</style>
