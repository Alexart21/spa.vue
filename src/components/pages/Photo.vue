<template>
  <h1 class="text-center">Photo</h1>
  <template v-if="photos.length">
    <div class="photo-main">
      <div v-for="(photo, index) in photos" :key="photo.id" class="img-out">
        <picture>
          <img :src="photo.link" alt="" class="img-inner" />
        </picture>
        <div class="del" @click="delPhoto(photo.id, index)"><b>удалить</b></div>
      </div>
    </div>
    <div>
      <pagination
        @paginate="paginate($event)"
        v-model="page"
        :records="total"
        :per-page="per_page"
        :options="options"
      />
    </div>
  </template>
  <div v-else>
    <h2 :style="{ color: isOk ? '#222' : 'red' }">{{ statusText }}</h2>
  </div>
  <router-link :to="{name: 'dragdrop'}" class="btn btn-primary">
    Добавить фото
  </router-link>
</template>
<script>
import Pagination from "v-pagination-3";
import { mapGetters } from "vuex";
export default {
  components: {
    Pagination,
  },
  data() {
    return {
      isOk: true,
      statusText: "загрузка...",
      photos: [],
      // pagination
      page: 1,
      per_page: 2,
      total: 40,
      MAX_BTN_COUNT: 5,
      options: {
        chunk: 5,
        texts: {
          count: `Фото {from}-{to} из {count}`,
        },
      },
    };
  },
  methods: {
    async paginate(page) {
      this.statusText = "загрузка...";
      this.isOk = true;
      // console.log(page);
      await fetch("/images?page=" + page)
        .then((response) => response.json())
        .then((result) => {
          if (result.success && result.all) {
            console.log(result.all)
            this.photos = result.all.data;
            if (!this.photos.length) {
              this.statusText = "Фотографий не найдено";
              return;
            }
            this.total = result.all.total;
            this.page = result.all.current_page;
            this.per_page = result.all.per_page;
            this.options.chunk =
              result.all.last_page > this.MAX_BTN_COUNT
                ? this.MAX_BTN_COUNT
                : result.all.last_page;
            // console.log(result.all);
          } else if (result.success && !result.all) {
            console.log("no photos");
            this.statusText = "Фотографий не найдено";
          }
        })
        .catch((error) => {
          console.log("error", error);
          this.isOk = false;
          this.statusText = "Ошибка сервера";
        });
    },

    async delPhoto(id, index) {
      let formData = new FormData();
      formData.append("_token", this.csrf);
      await fetch("/remove?id=" + id, {
        method: "POST",
        body: formData,
      })
        .then((response) => response.json())
        .then((result) => {
          if (result.success && result.deletedId == id) {
            this.photos.splice(index, 1);
            // после удаление к первой странице
            this.paginate(1);
          }
        //   console.log(result);
        })
        .catch((error) => console.log("error", error));
    },
  },
  computed: {
    ...mapGetters(["csrf"]),
    btnCount() {
      return this.last_page < 10 ? this.last_page : 10;
    },
  },
  mounted() {
    this.paginate(1);
  },
};
</script>
<style scoped>
.photo-main {
  display: flex;
  /* justify-content: center; */
  flex-wrap: wrap;
}
.img-out {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  max-width: 200px;
  border: 1px solid transparent;
  border-radius: 5px;
  margin: 1em;
  box-shadow: 5px 5px 20px #999;
}

.img-inner {
  width: 200px !important;
  height: auto;
}

.img-out picture {
  display: block;
}

.img-out .del {
  flex-grow: 0;
  color: red;
  cursor: pointer;
}
</style>
