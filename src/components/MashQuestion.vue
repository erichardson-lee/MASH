<script setup lang="ts">
import { MashTopic } from "../utils/mash";
import Button from "./Button.vue";
defineProps<{ edit: boolean }>();

const model = defineModel<MashTopic>({ required: true });
const emit = defineEmits(["remove"]);

function addAnswer() {
  model.value.answers.push({ text: "" });
}
function removeAnswer(index: number) {
  console.log("remove", index, model.value);
  model.value.answers.splice(index, 1);
}
</script>

<template>
  <div class="bg-gray-700 pa-2 rounded flex flex-col">
    <template v-if="edit">
      <div class="flex flex-row gap-2">
        <input
          v-model="model.title"
          class="w-full px-2 bg-gray-700 text-white text-lg text-center"
        />
        <Button @click="() => emit('remove')" label="🗑️" />
      </div>
    </template>
    <template v-else>
      <h2 class="text-center ma-0">{{ model?.title }}</h2>
    </template>
    <ul class="list-none pa-0">
      <template v-for="(ans, i) in model?.answers" :key="i">
        <li
          class="ma-2 pa-3 rounded bg-gray-600 font-bold flex gap-2"
          :class="{
            highlight: ans.highlight,
            selected: ans.state === 'selected',
            crossed: ans.state === 'crossed',
          }"
        >
          <template v-if="edit">
            <input
              v-model="ans.text"
              class="w-full px-2 bg-gray-700 text-white"
            />
            <Button @click="() => removeAnswer(i)" label="🗑️" />
          </template>
          <template v-else>{{ ans.text }}</template>
        </li>
      </template>
    </ul>

    <Button
      v-if="edit"
      class="w-full mt-auto"
      @click="() => addAnswer()"
      label="Add Answer"
    />
  </div>
</template>

<style scoped>
.highlight {
  padding: 0.5rem;
  border: 0.25rem solid greenyellow;
  box-sizing: border-box;
}

.selected {
  background-color: #44f;
}

.crossed {
  text-decoration: line-through;
  color: #f44;
}
</style>
