<script setup lang="ts">
import { computed, reactive, ref } from "vue";
import MashQuestion from "./components/MashQuestion.vue";
import Button from "./components/Button.vue";
import { MashTopic, delay, play, reset } from "./utils/mash";
import { defaultAnswers } from "./utils/defaultAnswers";

const gameStage = ref<"Setting Up" | "Rolling" | "Playing" | "Game Over">(
  "Setting Up"
);
const edit = computed<boolean>(() => gameStage.value === "Setting Up");

const topics = reactive<MashTopic[]>(defaultAnswers);

function addTopic() {
  topics.push({ title: "", answers: [] });
}

function removeTopic(index: number) {
  topics.splice(index, 1);
}

const roll = ref(5);

async function start() {
  gameStage.value = "Rolling";

  const t = setInterval(
    () => (roll.value = Math.floor(Math.random() * 7 + 3)),
    100
  );
  await delay(3000);
  clearInterval(t);
  await delay(1000);

  gameStage.value = "Playing";

  await play(topics, roll.value);

  gameStage.value = "Game Over";
}

function restart() {
  gameStage.value = "Setting Up";
  reset(topics);
}
</script>

<template>
  <main>
    <h1 class="text-center">{{ gameStage }}</h1>

    <template v-if="gameStage !== 'Setting Up'">
      <h2 class="text-center">Your Magic Number is {{ roll }}</h2>
    </template>

    <div class="flex flex-row flex-wrap gap-4 justify-center">
      <template v-for="(_, i) of topics" :key="i">
        <MashQuestion
          class="min-w-75"
          :edit="edit"
          v-model="topics[i]"
          @remove="() => removeTopic(i)"
        />
      </template>

      <Button v-if="edit" label="New" @click="addTopic" />
    </div>

    <Button
      v-if="edit"
      label="Start"
      class="text-4xl font-bold w-full mt-auto"
      @click="start"
    />
    <Button
      v-if="gameStage === 'Game Over'"
      label="Reset"
      class="text-4xl font-bold w-full mt-auto"
      @click="restart"
    />
  </main>
</template>

<style scoped>
main {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  padding: 1rem;
  box-sizing: border-box;
}
</style>
