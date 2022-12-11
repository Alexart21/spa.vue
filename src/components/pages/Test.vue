<template>
    <!-- <form ref="testForm"  @submit.prevent="sendForm" action=""> -->
    <form class="test-form" ref="testForm"  @submit.prevent="sendFormAxios" action="">
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
        <br>
        <input ref="avatar_img" type="file" name="avatar_img">
        <div v-if="err.avatar_img" style="color:red">
            <div v-for="item,i in err.avatar_img" :key="i">{{ item }}</div>
        </div>
        <br>
        <!-- <div v-if="isFileSelected && uploadPercentage" class="progress">
            <div class="progress-bar progress-bar-striped" :class="progressClass" :style="{width: uploadPercentage + '%'}"></div>
            <span class="percent">{{ percentage }}</span>
        </div> -->
        <template v-if="isFileSelected && uploadPercentage">
            <br>
            <progress-bar :bootstrapClass="progressClass" :percentage="percentage" />
        </template>
        <div v-show="loader">отправка...</div>
        <h3 :style="{color: msgColor}">{{ statusText }}</h3>
        <input type="submit" class="btn btn-success" :disabled="disabled" value="отправить">
    </form>
</template>
<script>
import { mapGetters } from 'vuex';
import axios from 'axios';
import ProgressBar from './../ui/ProgressBar';
export default {
    components: {
        ProgressBar,
    },
    data(){
        return {
            name: '',
            age: '',
            isFileSelected: false,
            uploadPercentage: 0,
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
            this.uploadPercentage = 0;
            this.loader = true;
            this.success = true;
            this.statusText = '';
            this.disabled = true;
        },
        stop(){
            this.loader = false;
            this.disabled = false;
        },
        /*
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
                }
            })
            .catch((error) => {
                console.log("error", error);
                this.success = false;
                this.statusText = "ошибка!";
                this.stop();
            })
            this.stop();
        },
        */
        
        async sendFormAxios(){
            this.start();
            this.isFileSelected = this.$refs.avatar_img.files.length;
            let formData = new FormData(this.$refs.testForm);
            formData.append('_token', this.csrf);
            await axios.post('/api/test',
             formData,
             {
                headers: {
                'Content-Type': 'multipart/form-data'
                },
                onUploadProgress: (progressEvent) => {
                    this.uploadPercentage = parseInt(Math.round(( progressEvent.loaded / progressEvent.total) * 100));
                }
             }
             )
            .then((response) => {
                if(response.data.success){
                    this.statusText = 'Успешно!';
                    console.log(this.uploadPercentage);
                }else{
                    this.success = false;
                    this.statusText = 'Что то пошло не так...';
                }
            })
            .catch((error) => {
                console.log(error.response)
                if(error.response.status === 422){
                    let errors = error.response.data.errors;
                    for(let key in errors){
                        this.err[key] = errors[key];
                    }
                }else if (error.response.status === 500){
                    this.success = false;
                    this.statusText = "ошибка сервера!";
                }
            });
            this.stop();
        },
        
        
    },
    computed: {
        ...mapGetters(["csrf"]),
        msgColor(){
            return this.success ? 'green' : 'red';
        },
        percentage(){
            return this.uploadPercentage ?? 0;
        },
        progressClass(){
            return !this.err.avatar_img ? 'bg-success' : 'bg-danger';
        }
    }
    

}
</script>
<style scoped>
label{
    display: block;
}
.test-form{
    width: 15em;
}
    input[type=text]{
        padding: .5em;
        display: block;
        width: 100%;
        border: 1px solid #222;
        border-radius: 4px;
    }
</style>