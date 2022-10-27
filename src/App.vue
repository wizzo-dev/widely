<template>
  <div v-if="loaded">
    <router-view/>
  </div>
    <div id="wave_animation_wrapper" v-if="$store.state.isLoading">
      <div id="wave_animation">
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
</template>

<style lang="scss"></style>

<script>
export default {
  data() {
    return {
      words: [],
      loaded:false
    }
  },
  mounted() {
    this.$store.commit('setIsLoading', {isLoading: true})
    this.api({ action: 'general', method: 'get' }, (data) => {

      
      localStorage.setItem('user_token' , data.data.cookie);
      const { words } = data.data
      this.$store.commit('setWords', {words})

      this.$store.commit('setIsLoading', {isLoading: false})
      this.loaded = true
    })
  }
}
</script>

