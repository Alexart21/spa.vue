import { createStore } from "vuex";

const store = {
  state: {
    modal: false,
    showCitys: false,
    regions: [
      { code: 1998532, name: "Адыгея" },
      { code: 3160, name: "Алтайский край" },
      { code: 3223, name: "Амурская обл." },
      { code: 3251, name: "Архангельская обл." },
      { code: 3282, name: "Астраханская обл." },
      { code: 3296, name: "Башкортостан(Башкирия)" },
      { code: 3352, name: "Белгородская обл." },
      { code: 3371, name: "Брянская обл." },
      { code: 3407, name: "Бурятия" },
      { code: 3437, name: "Владимирская обл." },
      { code: 3468, name: "Волгоградская обл." },
      { code: 3503, name: "Вологодская обл." },
      { code: 3529, name: "Воронежская обл." },
      { code: 3630, name: "Дагестан" },
      { code: 3673, name: "Еврейская обл." },
      { code: 3675, name: "Ивановская обл." },
      { code: 3703, name: "Иркутская обл." },
      { code: 3751, name: "Кабардино-Балкария" },
      { code: 3761, name: "Калининградская обл." },
      { code: 3827, name: "Калмыкия" },
      { code: 3841, name: "Калужская обл." },
      { code: 3872, name: "Камчатская обл." },
      { code: 3892, name: "Карелия" },
      { code: 3921, name: "Кемеровская обл." },
      { code: 3952, name: "Кировская обл." },
      { code: 3994, name: "Коми" },
      { code: 4026, name: "Костромская обл." },
      { code: 4052, name: "Краснодарский край" },
      { code: 4105, name: "Красноярский край" },
      { code: 4176, name: "Курганская обл." },
      { code: 4198, name: "Курская обл." },
      { code: 4925, name: "Ленинградская обл." },
      { code: 4227, name: "Липецкая обл." },
      { code: 4243, name: "Магаданская обл." },
      { code: 4270, name: "Марий Эл" },
      { code: 4287, name: "Мордовия" },
      { code: 4312, name: "Москва и Московская обл." },
      { code: 4481, name: "Мурманская обл." },
      { code: 3563, name: "Нижегородская обл." },
      { code: 4503, name: "Новгородская обл." },
      { code: 4528, name: "Новосибирская обл." },
      { code: 4561, name: "Омская обл." },
      { code: 4593, name: "Оренбургская обл." },
      { code: 4633, name: "Орловская обл." },
      { code: 4657, name: "Пензенская обл." },
      { code: 4689, name: "Пермская обл." },
      { code: 4734, name: "Приморский край" },
      { code: 4773, name: "Псковская обл." },
      { code: 4800, name: "Ростовская обл." },
      { code: 4861, name: "Рязанская обл." },
      { code: 4891, name: "Самарская обл." },
      { code: 4969, name: "Саратовская обл." },
      { code: 5011, name: "Саха (Якутия)" },
      { code: 5052, name: "Сахалин" },
      { code: 5080, name: "Свердловская обл." },
      { code: 5151, name: "Северная Осетия" },
      { code: 5161, name: "Смоленская обл." },
      { code: 5191, name: "Ставропольский край" },
      { code: 5225, name: "Тамбовская обл." },
      { code: 5246, name: "Татарстан" },
      { code: 3784, name: "Тверская обл." },
      { code: 5291, name: "Томская обл." },
      { code: 5326, name: "Тульская обл." },
      { code: 5312, name: "Тыва (Тувинская Респ.)" },
      { code: 5356, name: "Тюменская обл." },
      { code: 5404, name: "Удмуртия" },
      { code: 5432, name: "Ульяновская обл." },
      { code: 5473, name: "Хабаровский край" },
      { code: 2316497, name: "Хакасия" },
      { code: 2499002, name: "Ханты-Мансийский АО" },
      { code: 5507, name: "Челябинская обл." },
      { code: 5543, name: "Чечено-Ингушетия" },
      { code: 5555, name: "Читинская обл." },
      { code: 5600, name: "Чувашия" },
      { code: 2415585, name: "Чукотский АО" },
      { code: 5019394, name: "Ямало-Ненецкий АО" },
      { code: 5625, name: "Ярославская обл." },
    ],
    citys: [],
  },
  getters: {
    modal: (state) => state.modal,
    regions: (state) => state.regions,
    citys: (state) => state.citys,
    showCitys: (state) => state.showCitys,
  },
  mutations: {
    showCallModal(state) {
      state.modal = true;
      //   console.log(state.modal);
    },
    hideCallModal(state) {
      state.modal = false;
    },
    setCitys(state, response) {
      state.citys = response.data;
      state.showCitys = true;
    },
  },
  actions: {
    async loadCitys(context, code) {
      let url = "/region?code=" + code;
      let response = await fetch(url);
      response = await response.json();
      context.commit("setCitys", response);
    },
  },
  strict: process.env.NODE_ENV !== "production",
};
export default createStore(store);
