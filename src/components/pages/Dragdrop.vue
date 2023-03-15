<template>
  <h1>Drag & Drop</h1>
  <router-link :to="{ name: 'photo' }" class="btn btn-primary">
    Фотогалерея
  </router-link>
  <div class="main">
    <div
      class="dropzone-container"
      @dragover="dragover"
      @dragleave="dragleave"
      @drop="drop"
    >
      <form
        @submit.prevent="uploadFiles()"
        ref="imgs_form"
        id="imgs_form"
        action=""
      >
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
            <button @click="remove(files.indexOf(file))" title="Remove file">
              <b>&times;</b>
            </button>
          </div>
        </div>
      </div>
      <template v-if="percentage">
        <br />
        <progress-bar
          :bootstrapClass="progressClass"
          :percentage="percentage"
        />
      </template>
      <h3 :style="{ color: success ? 'green' : 'red' }">{{ statusText }}</h3>
    </div>
    <div class="send-block">
      <div v-if="loader" class="loader">
        <loader />
      </div>
      <button type="submit" form="imgs_form" class="btn btn-success sb-btn">
        SEND
      </button>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { mapGetters } from "vuex";
import ProgressBar from "@/components/ui/ProgressBar";
import Loader from "@/components/ui/Loader";
export default {
  components: {
    ProgressBar,
    Loader,
  },
  data() {
    return {
      MAX_FILE_COUNT: 10,
      MAX_FILE_SIZE: 200, // kb
      isDragging: false,
      files: [],
      loader: false,
      disabled: false,
      percentage: 0,
      success: true,
      statusText: "",
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
    startUpload() {
      this.disabled = true;
      this.success = true;
      this.loader = true;
      this.percentage = 0;
    },
    stopUpload() {
      this.loader = false;
      this.disabled = false;
    },
    validate() {
      if (!this.files.length) {
        console.log("empty files!");
        return false;
      } else if (this.files.length > this.MAX_FILE_COUNT) {
        this.success = false;
        this.statusText = `Не более ${this.MAX_FILE_COUNT} файлов по ${this.MAX_FILE_SIZE} кБ каждый`;
        return false;
      } else {
        let err = this.files.filter(item => {
          return item.size > (this.MAX_FILE_SIZE * 1024);
        })
        if(err.length) {
          this.success = false;
          this.statusText = `Файл ${err[0].name} весит более ${this.MAX_FILE_SIZE} кБ`;
          return false;
        }
        return true;
      }
    },
    async uploadFiles() {
      if (!this.validate()) return;
      this.startUpload();
      // let formData = new FormData(this.$refs.imgs_form);
      let formData = new FormData();
      this.files.forEach((file) => {
        formData.append("images[]", file);
      });
      formData.append("_token", this.csrf);
      await axios({
        method: "POST",
        url: "/upload",
        data: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          this.percentage = parseInt(
            Math.round((progressEvent.loaded / progressEvent.total) * 100)
          );
        },
      })
        .then((response) => {
          if (response.data.success) {
            this.statusText = "Успешно!";
            console.log(this.uploadPercentage);
          } else {
            this.success = false;
            // console.log('here1');
            this.statusText = "Что то пошло не так...";
          }
        })
        .catch((error) => {
          this.success = false;
          let errText;
          if (error.response.status == 422) {
            let errors = error.response.data.errors;
            // так по разному ответы Laravel дает поскольку мултизагрузка файлов
            try{
              errText = errors['images.0'][0]
            }catch(err){
              try{
                errText = errors.images[0];
              }catch(err){
                errText = 'Ошибка!';
              }
            }
          }else if(error.response.status == 403){
            errText = 'Требуется авторизация!';
          }else if(error.response.status == 500){
            errText = 'Ошибка сервера!';
          }else{
            errText = `Ошибка ${error.response.status} ${error.response.statusText}!`;
          }
          this.statusText = errText;
          console.log(error.response);
        });
      this.stopUpload();
    },
    getToken(){
      console.log("csrf2=" + this.csrf)
    }
  },
  mounted() {
    setTimeout(this.getToken, 10000)
    console.log("csrf=" + this.csrf);
  },
  computed: {
    ...mapGetters(["csrf"]),
    progressClass() {
      return this.success ? "bg-success" : "bg-danger";
    },
  },
};
</script>

<style scoped>
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

.sb-btn {
  display: block;
  margin-top: 1em;
}
.cloud-icon svg {
  /* fill: red; */
  width: 50px;
  height: 50px;
}
.send-block {
  position: relative;
  /* height: 2em; */
  /* line-height: 2em; */
}
.loader {
  position: absolute;
  left: -2em;
}
</style>
