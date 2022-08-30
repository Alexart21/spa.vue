<template>
  <h1>Select country && region && city</h1>
  <table>
    <tr>
      <th>Страна</th>
      <th>Регион</th>
      <th>Город</th>
    </tr>
    <tr>
      <td>
        <select ref="country" @change="selectCountry" v-model="country_id">
          <option
            v-for="(item, index) in countrys"
            :value="item.country_id"
            :key="index"
          >
            {{ item.name }}
          </option>
        </select>
      </td>
      <td>
        <select
          ref="region"
          @change="selectRegion"
           @input="changeLoc"
          v-model="region_id"
        >
          <option
            v-for="(item, index) in regions"
            :value="item.region_id"
            :key="index"
          >
            {{ item.name }}
          </option>
        </select>
      </td>
      <td>
        <select v-model="city" @change="selectCity">
          <option v-for="(item, index) in citys" :value="item.name" :key="index">
            {{ item.name }}
          </option>
        </select>
      </td>
    </tr>
  </table>
  <br>
  <div style="font-size: 160%">Выбрано: <b>{{ location }}</b></div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";

export default {
  data() {
    return {
      country_id: 3159, // страна россия
      region_id: 4312, // регион Москва и Московская обл.
      // region_id: 5600, // регион Чувашия
      country: 'Россия',
      region: 'Москва и Московская обл.',
      city: 'Абрамцево',

    };
  },
  methods: {
    ...mapActions(["loadCitys", "loadRegions", "loadCountrys"]),
    selectCountry() {
      this.$store.commit("clearRegions");
      this.$store.commit("clearCitys");
      this.region_id = 0;
      this.region = '';
      this.city = '';
      this.loadRegions(this.country_id);
      this.changeLoc();
    },
    selectRegion(){
      this.city = '';
      this.loadCitys(this.region_id);
      this.changeLoc();
    },
    selectCity(){
      this.changeLoc();
    },
    changeLoc(){
      let countris = this.$refs.country.options;
      let regions = this.$refs.region.options;
      let res = '';
      for(let i=0;i<countris.length;i++){
        if(countris[i].value == this.country_id){
          this.country = countris[i].innerText
        }
      }
      for(let i=0;i<regions.length;i++){
        if(regions[i].value == this.region_id){
          this.region = regions[i].innerText
        }
      }
    },
  },
  computed: {
    ...mapGetters(["countrys", "regions", "citys", "showCitys"]),
    location(){
      if(this.country === this.region || this.region === this.city){
        return this.country + ' - ' +  this.city;
      }else{
        return this.country + ' - ' + this.region + ' - ' + this.city; 
      }
    }
  },
  mounted() {
    this.loadCountrys();
    this.loadRegions(this.country_id);
    this.loadCitys(this.region_id);
  },
};
</script>
