import axios from "axios";
axios.defaults.baseURL = "http://localhost:3000/api";

export default {
  namespaced: true,
  state: {
    notes: []
  },
  mutations: {
    setNotes(state, payload) {
      state.notes = payload;
    },
    deleteFrontNote(state, payload) {
      state.notes = payload
    }
  },
  actions: {
    getNotes({ commit }) {
      axios
        .get("/notes")
        .then(res => {
          commit("setNotes", res.data);
        })
        .catch(e => {
          this.getAlert(
            "error",
            "Hubo un error al cargar la página, vuelve a intentarlo"
          );
        });
    }
  },
  deleteNote({commit}, id) {
    axios
      .delete(`/note/${id}`)
      .then(res => {
        // findIndex - función para encontrar el index en el array notas comparado con res
        const index = this.notes.findIndex(item => item._id == res.data._id);
        // Operación para actualizar el array (en el front) sin sobrecargas la app
        this.notes.splice(index, 1);
        commit('deleteFrontNote', )
        this.getAlert(
          "success",
          `LA NOTA ${res.data.title} HA SIDO ELIMINADA`
        );
      })
      .catch(e => {
        console.log(e.response);
      });
  }
};
