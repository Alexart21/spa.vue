<template>
    <h1>Drag & Drop</h1>
    <div class="main">
      <div
        class="dropzone-container"
        @dragover="dragover"
        @dragleave="dragleave"
        @drop="drop"
      >
      <form @submit.prevent="uploadFiles()" ref="imgs_form"  id="imgs_form" action="">
        <input
          type="file"
          multiple
          name="images[]"
          id="fileInput"
          class="hidden-input"
          @change="onChange"
          ref="file"
          accept=".pdf,.jpg,.jpeg,.png"
        />
      </form>
      <mdicon name="cloud-upload-outline" class="cloud-icon" />
        <label for="fileInput" class="file-label">
          <div v-if="isDragging">Release to drop files here.</div>
          <div v-else>Drop files here or <u>click here</u> to upload.</div>
        </label>
  
        <div class="preview-container mt-4" v-if="files.length">
          <div v-for="file in files" :key="file.name" class="preview-card">
            <div>
              <img class="preview-img" :src="generateThumbnail(file)" />
              <p :title="file.name">
                {{ makeName(file.name) }}
              </p>
            </div>
            <div>
              <button
                @click="remove(files.indexOf(file))"
                title="Remove file"
              >
                <b>&times;</b>
              </button>
            </div>
          </div>
        </div>
        <template v-if="percentage">
        <br>
        <progress-bar :bootstrapClass="progressClass" :percentage="percentage" />
      </template>
      <h3 :style="{color: success ? 'green' : 'red'}">{{ statusText }}</h3>
      </div>
      <button type="submit" form="imgs_form" class="btn btn-success sb-btn">SEND</button>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  import { mapGetters } from 'vuex';
  import ProgressBar from './../ui/ProgressBar';
  export default {
    components: {
        ProgressBar,
    },
    data() {
      return {
        isDragging: false,
        files: [],
        percentage: 0,
        success: true,
        statusText: '',
      };
    },
    methods: {
      onChange() {
        this.files = [...this.$refs.file.files];
        // console.log(this.files)
      },
  
      generateThumbnail(file) {
        let fileSrc = URL.createObjectURL(file);
        setTimeout(() => {
          URL.revokeObjectURL(fileSrc);
        }, 1000);
        return fileSrc;
      },
  
      makeName(name) {
        return (
          name.split(".")[0].substring(0, 3) +
          "..." +
          name.split(".")[name.split(".").length - 1]
        );
      },
  
      remove(i) {
        this.files.splice(i, 1);
        // console.log(this.files);
      },
  
      dragover(e) {
        e.preventDefault();
        this.isDragging = true;
      },
  
      dragleave() {
        this.isDragging = false;
      },
  
      drop(e) {
        e.preventDefault();
        this.$refs.file.files = e.dataTransfer.files;
        this.onChange();
        this.isDragging = false;
      },
      //
      async uploadFiles() {
        this.success = true;
        this.percentage = 0;
        console.log(this.files)
        if(!this.files.length){
          console.log('empty files!');
          return;
        }
        // let formData = new FormData(this.$refs.imgs_form);
        let formData = new FormData();
        this.files.forEach((file) => {
          formData.append("images[]", file);
        });
        formData.append('_token', this.csrf);
        await axios({
            method: "POST",
            url: '/api/upload',
            data: formData,
            headers: {
                "Content-Type": "multipart/form-data",
            },
            onUploadProgress: (progressEvent) => {
              this.percentage = parseInt(Math.round(( progressEvent.loaded / progressEvent.total) * 100));
            }
        })
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
                console.log(error.response);
                this.success = false;
            });
      },
    },
    computed: {
      ...mapGetters(["csrf"]),
      progressClass(){
        return this.success ? 'bg-success' : 'bg-danger';
      }
    }
  };
  </script>
  
  <style>
  .main {
    display: flex;
    flex-grow: 1;
    align-items: center;
    /* height: 100vh; */
    justify-content: center;
    text-align: center;
    flex-direction: column;
  }
  .dropzone-container {
    padding: 4rem;
    background: #f7fafc;
    border: 1px solid #e2e8f0;
  }
  .hidden-input {
    opacity: 0;
    overflow: hidden;
    position: absolute;
    width: 1px;
    height: 1px;
  }
  .file-label {
    font-size: 20px;
    display: block;
    cursor: pointer;
  }
  .preview-container {
    display: flex;
    margin-top: 2rem;
  }
  .preview-card {
    display: flex;
    border: 1px solid #a2a2a2;
    padding: 5px;
    margin-left: 5px;
  }
  .preview-img {
    width: 50px;
    height: 50px;
    border-radius: 5px;
    border: 1px solid #a2a2a2;
    background-color: #a2a2a2;
  }

  .sb-btn{
    margin-top: 1em;
  }
  .cloud-icon svg{
    /* fill: red; */
    width: 50px;
    height: 50px;
  }
  </style>
  