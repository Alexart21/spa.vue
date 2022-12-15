<template>
<template v-if="src">
    <vue-cropper
    ref="cropper"
    :src="src"
    alt="Source Image"
 />
 <div v-if="fileName">
    <h5>{{ fileName }}</h5>
 </div>
 </template>
 <input type="file" @change="readFile" ref="imgInp">
 <br>
 <br>
 <button @click="send" type="button" class="btn btn-success">send to server</button>
 <br>
 <br>
 <button @click="save" type="button" class="btn btn-success">save</button>
 <template v-if="percentage">
        <br>
        <progress-bar :bootstrapClass="progressClass" :percentage="percentage" />
      </template>
      <h3 :style="{color: success ? 'green' : 'red'}">{{ statusText }}</h3>
 <div v-if="croppedSrc">
    <h1>Cropped</h1>
    <img :src="croppedSrc" alt="">
 </div>
</template>
<script>
import VueCropper from 'vue-cropperjs';
import 'cropperjs/dist/cropper.css';
import axios from 'axios';
import ProgressBar from './../ui/ProgressBar';
import { mapGetters } from 'vuex';
export default {
  components: {
    VueCropper,
    ProgressBar
  },
  data(){
    return {
        src: '',
        croppedSrc: '',
        file: null,
        fileName: null,
        percentage: 0,
        success: true,
        statusText: '',
    }
  },
  methods: {
    readFile() { // 
      this.src = null;
      let input = this.$refs.imgInp;
      let file = input.files[0];
      let reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
          this.src =  reader.result;
          this.fileName = file.name;
          input.value = null;
      }
      reader.onerror = () => {
        console.log(reader.error);
      };
    },
    cropImage() {
      this.croppedSrc = this.$refs.cropper.getCroppedCanvas().toDataURL();
    },
    async base64ToFile(url){
        // с помощью fetch() конвертируем base64 => blob => file
        await fetch(url)
        .then(res => res.blob())
        .then(blob => {
            this.file = new File([blob], "temp.png",{ type: "image/png" });
        })
    },
    async send(){
        this.cropImage();
        if(!this.croppedSrc) {
            console.log('no cropped img')
            return;
        }
        // base64 => blob => file
        await this.base64ToFile(this.croppedSrc);
        this.cropImage();
        this.success = true;
        let formData = new FormData();
        formData.append('_token', this.csrf);
        formData.append('cropped_img', this.file);
        let url = '/crop'
        await axios({
            method: "POST",
            url: url,
            data: formData,
            headers: {
                "Content-Type": "multipart/form-data",
            },
            onUploadProgress: (progressEvent) => {
              this.percentage = parseInt(Math.round(( progressEvent.loaded / progressEvent.total) * 100));
            }
        })
        .then((response) => {
        // console.log(response)
        if(response.data.success){
            this.statusText = 'Успешно!';
            // console.log(this.percentage);
        }else{
            this.success = false;
            this.statusText = 'Что то пошло не так...';
        }
        })
        .catch((error) => {
            console.log(error.response);
            this.success = false;
            this.statusText = 'Ошибка сервера!';
        });
    },
    strRand(len) { // случайная строка для имени файла
      let result = '';
      let words = '0123456789qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM';
      let max_position = words.length - 1;
      for (let i = 0; i < len; ++i) {
        let position = Math.floor(Math.random() * max_position);
        result = result + words.substring(position, position + 1);
      }
      return result;
    },
    save(){
        this.cropImage();
        let link = document.createElement('a');
        let fileName = this.strRand(12) + '.png';
        link.download = fileName;
        link.href = this.croppedSrc;
        link.click();
    }
  },
  computed: {
    ...mapGetters(["csrf"]),
    progressClass(){
        return this.success ? 'bg-success' : 'bg-danger';
      }
  },
}
</script>