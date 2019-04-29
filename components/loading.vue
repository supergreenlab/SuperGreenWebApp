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
  <div :id='$style.loading'>
    <div :id='$style.loadingpic'></div>
    {{ label }}
  </div>
</template>

<script>
export default {
  props: ['label']
}
</script>

<style module lang=stylus>

@-webkit-keyframes rotation {
  from {
    -webkit-transform: rotate(0deg);
  }
  to {
    -webkit-transform: rotate(359deg);
  }
}

#loading
  display: flex
  flex-direction: column
  align-items: center
  justify-content: center
  position: absolute
  top: 0
  left: 0
  width: 100%
  height: 100%
  border-radius: 3pt
  background-color: rgba(255, 255, 255, 0.8)
  z-index: 3

#loadingpic
  width: 20pt
  height: 20pt
  margin-bottom: 10pt
  background-image: url('~assets/img/loading.svg')
  background-position: center
  background-size: contain
  background-repeat: no-repeat
  animation: rotation 2s infinite 

</style>
