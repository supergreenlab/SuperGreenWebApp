<template>
  <BoxSubSection 
  icon='subsection-dimming-master.svg'
  title='Master switch'
  value='50w'>
    <small :id='$style.masterhint'>Dims all leds +25% or -25% at once.</small>
    <div :id='$style.masterbody'>
      <div :class='$style.masterbuttons' :id='$style.plus' @click='masterplus'></div>
      <div :id='$style.separator'></div>
      <div :class='$style.masterbuttons' :id='$style.minus' @click='masterminus'></div>
      <Loading v-if='loading' width='50pt' height='30pt' />
    </div>
  </BoxSubSection>
</template>

<script>
</script>

<style module lang=stylus>
</style>
