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
    <div :id='$style.liveviews'>
      <div v-for='source in sources' :class='$style.liveview' :style='{"background-image": `url(${source.url}?rand=${sourceRand})`}' @click='openPic(source)'>
        <div><img @click='evt => removeSource(evt, source)' src='~/assets/img/remove-timelapse.svg' /></div>
      </div>
      <div :class='`${$style.liveview} ${$style.add}`' @click='showAddSource'></div>
      <div v-if='showing_add_source' :id='$style.add_source'>
        <input type='text' ref='name' />
        <button @click='addSource()'>add timelapse</button>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  data: () => ({
    showing_add_source: false,
    sourceRand: Math.floor(Math.random() * Math.floor(Number.MAX_SAFE_INTEGER)),
  }),
  created() {
    this.interval = setInterval(() => this.$data.sourceRand = Math.floor(Math.random() * Math.floor(Number.MAX_SAFE_INTEGER)), 5*60*1000)
  },
  destroyed() {
    clearInterval(this.interval)
  },
  computed: {
    sources() {
      const controller = this.controller,
            i = this.$route.params.box,
            box = this.controller.boxes[i]
      return this.$store.getters['liveviews/sources'](`${controller.broker_clientid.value}.${i}.`)
    },
    controller() {
      return this.$store.getters['controllers/getSelected']
    },
  },
  methods: {
    showAddSource() {
      this.$data.showing_add_source = !this.$data.showing_add_source
    },
    addSource() {
      const controller = this.controller,
            i = this.$route.params.box,
            sources = this.sources
      this.$data.showing_add_source = false
      this.$store.commit('liveviews/addSource', {
        id: `${controller.broker_clientid.value}.${i}.${sources.length}`,
        url: this.$refs.name.value,
      })
    },
    removeSource(evt, source) {
      evt.preventDefault()
      evt.stopPropagation()
      this.$store.commit('liveviews/removeSource', source)
    },
    openPic(source) {
      window.open(source.url, source.id)
    },
  },
}
</script>

<style module lang=stylus>

#container
  flex: 1

#liveviews
  position: relative
  display: flex
  margin-top: 10pt
  flex-wrap: wrap;

.liveview
  width: 140pt
  height: 110pt
  background-position: center
  background-repeat: no-repeat
  background-size: contain
  cursor: pointer
  margin: 0pt 4pt 4pt 0

.liveview > div > img
  margin-top: 4pt
  margin-left: 2pt
  opacity: 0.5
  transition: opacity 0.2s

.liveview > div > img:hover
  opacity: 1

.add
  background-image: url('~assets/img/add-timelapse.svg')

#add_source
  display: flex
  flex-direction: column
  justify-content: center
  align-items: center
  position: absolute
  width: 100%
  height: 100%
  left: 0
  top: 0
  background-color: rgba(255, 255, 255, 0.7)

#add_source > input
  border: 1pt solid #bdbdbd
  border-radius: 2pt
  padding: 2pt
  margin: 5pt

#add_source > button
  background: transparent
  border: 1pt solid #bdbdbd
  border-radius: 2pt

</style>
