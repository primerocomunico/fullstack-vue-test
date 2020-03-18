<template>
  <div>
    <v-container>
      <h1 class="text-center">NOTES</h1>

<!--Begin alert-->
      <v-row>
        <v-col>
          <v-alert
            dense
            border="left"
            :type="alert.type"
            class="text-center"
            dismissible
            :value="flagAlert"
          >{{alert.message}}</v-alert>
        </v-col>
      </v-row>
      <!--End alert-->

     

      <!--Begin form Create note-->
      <v-row v-if="!editForm">
        <v-col>
          <h2>CREA UNA NUEVA NOTA</h2>
          <v-form @submit.prevent="setNote()">
            <v-text-field label="Título" required v-model="note.title"></v-text-field>
            <v-text-field label="Cuenta todos los detalles" v-model="note.description"></v-text-field>
            <v-btn type="submit" color="accent" class="my-2 block">AGREGAR</v-btn>
          </v-form>
        </v-col>
      </v-row>
      <!--End form Create note-->

      <!--Begin form Edit note-->
      <v-row v-if="editForm">
        <v-col>
          <h2>EDITAR LA NOTA</h2>
          <v-form @submit.prevent="updateNote(note)">
            <v-text-field label="Título" required v-model="note.title"></v-text-field>
            <v-text-field label="Cuenta todos los detalles" v-model="note.description"></v-text-field>
            <v-btn type="submit" color="warning" class="ma-2 block">ACTUALIZAR</v-btn>
            <v-btn type="button" color="grey" class="ma-2 block" dark @click="cancelEdit">CANCELAR</v-btn>
          </v-form>
        </v-col>
      </v-row>
      <!--End form Edit note-->

      <!--Begin table-->
    <v-row class="mx-auto">
      <v-col>
        <v-simple-table>
          <template v-slot:default>
            <thead>
              <tr>
                <th class="text-left">#</th>
                <th class="text-center">TITLE</th>
                <th class="text-center">DESCRIPTION</th>
                <th class="text-center">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) of notes" :key="item._id">
                <td>{{index + 1}}</td>
                <td>{{item.title}}</td>
                <td>{{item.description}}</td>
                <td class="text-center">
                  <v-btn
                    @click="deleteNote(item._id)"
                    color="error"
                    small
                    dark
                    class="button-err"
                  >Eliminar</v-btn>
                  <v-btn
                    @click="activeEdit(item._id)"
                    color="warning"
                    small
                    dark
                    class="button-err"
                  >Editar</v-btn>
                </td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-col>
    </v-row>
    <!--End table-->
    </v-container>
  </div>
</template>

<script>

// Store
import { mapState, mapActions } from 'vuex';

export default {
  name: "Notes",
  data() {
    return {
      flagAlert: false,
      notes: [],
      alert: { type: "warning", message: "" },
      note: { id: "", title: "", description: "" },
      editForm: false
    };
  },
  methods: {
      getNotes() {
      this.axios
        .get("/notes")
        .then(res => {
           this.notes = res.data;
        })
        .catch(e => {
          this.getAlert(
            "error",
            "Hubo un error al cargar la página, vuelve a intentarlo"
          );
        });
    },
    setNote() {
      this.axios
        .post("/newnote", this.note)
        .then(res => {
          this.notes.push(res.data);
          // Para resetar los campos del formulario
          this.note.title = "";
          this.note.description = "";
          this.note.id = "";
          this.getAlert("success", "Nueva nota creada satisfactoriamente");
        })
        .catch(e => {
          this.getAlert(
            "error",
            `ERROR ${e.response.status} - ${e.response.data.error.message}`
          );
        });
    },
    deleteNote(id) {
      this.axios
        .delete(`/note/${id}`)
        .then(res => {
          // findIndex - función para encontrar el index en el array notas comparado con res
          const index = this.notes.findIndex(item => item._id == res.data._id);
          // Operación para actualizar el array (en el front) sin sobrecargas la app
          this.notes.splice(index, 1);
          this.getAlert(
            "success",
            `LA NOTA ${res.data.title} HA SIDO ELIMINADA`
          );
        })
        .catch(e => {
          console.log(e.response);
        });
    },
    activeEdit(id) {
      this.editForm = true;
      this.axios
        .get(`/note/${id}`)
        .then(res => {
          this.note.title = res.data.title;
          this.note.description = res.data.description;
          this.note.id = res.data._id;
        })
        .catch(e => {
          console.log(e.response);
        });
    },
    cancelEdit() {
      this.editForm = false;
      this.note.title = "";
      this.note.description = "";
      this.note.id = "";
    },
    updateNote(note) {
      this.axios
        .put(`/note/${note.id}`, note)
        .then(res => {
          const index = this.notes.findIndex(item => item._id == res.data._id);
          this.notes[index].title = res.data.title;
          this.notes[index].description = res.data.description;
          this.getAlert("success", "NOTA EDITADA CON ÉXITO");
          this.cancelEdit();
        })
        .catch(e => {
          this.getAlert(
            "error",
            `ERROR ${e.response.status} - ${e.response.data.error.message}`
          );
        });
    },
    getAlert(type, message) {
      this.flagAlert = true;
      this.alert.type = type;
      this.alert.message = message;
      setTimeout(() => {
        this.flagAlert = false;
      }, 5000);
    }
  },
   created() {
    this.getNotes()
  }
};
</script>

<style scoped>
.button-err {
  margin: 20px 10px;
}
</style>