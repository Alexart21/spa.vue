<template>
  <h1>Region && City select</h1>
  <select
    name="region"
    ref="region"
    @change="loadCitys(region_code)"
    v-model="region_code"
  >
    <option
      v-for="(item, index) in regions"
      :value="item.region_id"
      :key="index"
    >
      {{ item.name }}
    </option>
  </select>
  <select name="citys" id="citys">
    <option v-for="(item, index) in citys" value="item.name" :key="index">
      {{ item.name }}
    </option>
  </select>
</template>
<script>
import { mapGetters, mapActions } from "vuex";

export default {
  data() {
    return {
      country_code: 3159, // страна россия
      region_code: 4312, // регион Москва и Московская обл.
      // region_code: 5600, // регион Чувашия
    };
  },
  methods: {
    ...mapActions(['loadCitys', 'loadRegions'])
  },
  computed: {
    ...mapGetters(["regions", "citys", "showCitys"]),
  },
  mounted() {
    this.loadRegions(this.country_code);
    this.loadCitys(this.region_code);
  },
};
</script>
