<template>
  <div>
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
  </div>
</template>

<script>
export default {
  name: "CreateNote"
};
</script>