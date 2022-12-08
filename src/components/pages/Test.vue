<template>
    <form ref="testForm"  @submit.prevent="sendForm" action="">
        <label for="name">Name</label>
        <input type="text" name="name" v-model="name">
        <div style="color:red">{{ err.name ?? '' }}</div>

        <label for="age">Age</label>
        <input type="text" name="age" v-model="age">
        <div style="color:red">{{ err.age ?? '' }}</div>
        <div v-show="loader">отправка...</div>
        <h3 :style="{color: msgColor}">{{ statusText }}</h3>
        <input type="submit" value="отправить">
        
    </form>
</template>
<script>
import { mapGetters } from 'vuex';
export default {
    data(){
        return {
            name: '',
            age: '',
            err: {},
            loader: false,
            success: true,
            statusText: '',
        }
    },
    methods: {
        async sendForm(){
            this.err = {};
            this.success = true;
            this.statusText = '';
            this.loader = true;
            let formData = new FormData(this.$refs.testForm);
            formData.append('_token', this.csrf);
            await fetch('/api/test', {
                method: 'post',
                body: formData
            })
            .then(response => response.json())
            .then(result => {
                if(result.success){
                    this.statusText = 'Успешно!';
                }
                if(result.errors){
                    for(let key in result.errors){
                        this.err[key] = result.errors[key][0];
                    }
                    // console.log(this.err)
                }
            })
            .catch((error) => {
                console.log("error", error);
                this.success = false;
                this.statusText = "ошибка!";
            })
            this.loader = false;
        }
    },
    computed: {
        ...mapGetters(["csrf"]),
        msgColor(){
            return this.success ? 'green' : 'red';
        }
    }
    

}
</script>
<style scoped>
label{
    display: block;
}
    input{
        display: block;
        width: 10em;
        border: 1px solid #222;
        border-radius: 4px;
    }
</style>