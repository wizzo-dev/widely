<template>
  <div v-if="loaded">
    <router-view/>
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
    this.api({ action: 'general', method: 'get' }, (data) => {

      
      localStorage.setItem('user_token' , data.data.cookie);
      const { words } = data.data
      this.$store.commit('setWords', {words})

      this.loaded = true;
    })
  }
}
</script>

