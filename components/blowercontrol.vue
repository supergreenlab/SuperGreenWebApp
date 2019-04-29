<template>
  <BoxSection
    icon='section-blower.svg'
    title='Blower control'
    color='#7DB0BB'>
    <div :id='$style.body'>
      <BlowerControlSubSection schedule='on' />
      <BlowerControlSubSection schedule='off' />
    </div>
  </BoxSection>
</template>

<script>

import BoxSection from '~/components/boxsection'
import BlowerControlSubSection from '~/components/blowercontrolsubsection'

export default {
  components: { BoxSection, BlowerControlSubSection, },
}

</script>

<style module lang=stylus>

#body
  display: flex
  flex: 1
  width: 100%

</style>
