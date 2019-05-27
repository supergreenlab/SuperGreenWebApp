<template>
  <BoxSubSection 
  icon='subsection-dimming-independent.svg'
  title='Independent light dimming'>
    <div :id='$style.timer'>Current timer desired power:&nbsp;<span :id='$style.timerpower'>{{ timerpower }}%</span></div>
    <div :id='$style.independentbody'>
      <div v-for='(led, j) in controller.leds' v-if='led.box.value == $route.params.box' :key='controller.broker_clientid.value + j' :class='$style.led'>
        <LedControl :j='j' :led='led' />
      </div>
    </div>
  </BoxSubSection>
</template>

<script>
</script>

<style module lang=stylus>
</style>
