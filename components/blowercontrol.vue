<template>
  <BoxSection
    icon='section-blower.svg'
    title='Blower control'
    color='#7DB0BB'>
    <div :id='$style.body'>
      <BlowerControlSubSection schedule='on' param='blower_day' />
      <BlowerControlSubSection schedule='off' param='blower_night' />
    </div>
  </BoxSection>
</template>

<script>

import BoxSection from '~/components/boxsection'
import BlowerControlSubSection from '~/components/blowercontrolsubsection'

export default {
  components: { BoxSection, BlowerControlSubSection, },
  computed: {
    controller() {
      return this.$store.getters['controllers/getSelected']
    },
  },
  mounted() {
    const controller = this.controller,
          boxid = this.$route.params.box
    this.$store.dispatch('controllers/load_box_param', {id: controller.broker_clientid.value, i: boxid, key: 'blower_day'})
    this.$store.dispatch('controllers/load_box_param', {id: controller.broker_clientid.value, i: boxid, key: 'blower_night'})
  },
}

</script>

<style module lang=stylus>

#body
  display: flex
  flex: 1
  width: 100%

</style>
