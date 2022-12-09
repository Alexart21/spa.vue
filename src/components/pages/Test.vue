<template>
    <form ref="testForm"  @submit.prevent="sendForm" action="">
        <label for="name">Name</label>
        <input type="text" name="name" v-model="name">
        <div v-if="err.name" style="color:red">
            <div v-for="item,i in err.name" :key="i">{{ item }}</div>
        </div>

        <label for="age">Age</label>
        <input type="text" name="age" v-model="age">
        <div v-if="err.age" style="color:red">
            <div v-for="item,i in err.age" :key="i">{{ item }}</div>
        </div>

        <div v-show="loader">отправка...</div>
        <h3 :style="{color: msgColor}">{{ statusText }}</h3>
        <input type="submit" :disabled="disabled" value="отправить">
        
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
            disabled: false,
            success: true,
            statusText: '',
        }
    },
    methods: {
        start(){
            this.err = {};
            this.loader = true;
            this.success = true;
            this.statusText = '';
            this.disabled = true;
        },
        stop(){
            this.loader = false;
            this.disabled = false;
        },
        async sendForm(){
            this.start();
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
                        this.err[key] = result.errors[key];
                    }
                    // console.log(this.err)
                }
            })
            .catch((error) => {
                console.log("error", error);
                this.success = false;
                this.statusText = "ошибка!";
                this.stop();
            })
            this.stop();
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