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
  <span :id='$style.supergreenlab' :style='{"font-size": size, color, margin}'>
    <span :class='vertical == true ? $style.supersmallword : ""'>S<span :class='$style.supersmall'>upe</span>r</span><br v-if='vertical != false' />
    <span :class='$style.supergreen'>G<span :class='$style.supersmall'>ree</span>n</span><br v-if='vertical != false' />
    <span>L<span :class='$style.supersmall'>a</span>b</span>
  </span>
</template>

<script>
export default {
  props: {
    vertical: {
      default: false,
    },
    size: {
      default: '1em',
    },
    color: {
      default: 'white',
    },
    margin: {
      default: '0pt',
    },
  }
}
</script>

<style module lang=stylus>

#supergreenlab
  font-family: 'PlumeAd'
  text-transform: uppercase
  letter-spacing: 1pt
  text-align: center

.supergreen
  color: #3BB30B

.supersmall
  font-size: 0.9em

.supersmallword
  font-size: 0.85em

</style>
