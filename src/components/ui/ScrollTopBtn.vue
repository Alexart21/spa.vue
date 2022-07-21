<template>
 <div v-show="showGoTop" @click="goTop" id="scroller" class="" title="проскролить вверх">
 ВВЕРХ
</div>   
</template>
<script>
export default {
    props: {
       showGoTop: {
           type: Boolean,
           default: false,
       } 
    },
    methods: {
      goTop() {
      window.scrollTo(0, 0)
    },  
    }
}
</script> 