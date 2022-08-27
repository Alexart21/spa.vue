<template>
  <h1>Region && City select</h1>
  <select name="region" ref="region" @change="regionSelect" v-model="code">
    <option v-for="(item, index) in regions"  :value="item.code" :key="index">{{ item.name }}</option>
  </select>
  <select v-show="showCitys" name="citys" id="citys" >
    <option v-for="(item, index) in citys" value="item.name" :key="index">{{ item.name }}</option>
  </select>
</template>
<script>
import { mapGetters, mapActions } from "vuex";

export default {
  data(){
    return {
      code: '',
    }
  },
  methods: {
    regionSelect(){
      this.$store.dispatch('loadCitys', this.code)
      // console.log(this.$refs.region.value)
      // console.log(this.code)
    }
  },
  computed: mapGetters(["regions", "citys", "showCitys"]),
  mounted() {
    // console.log('mounted region');
    // this.$store.dispatch('loadRegions')
  }
};
</script>
