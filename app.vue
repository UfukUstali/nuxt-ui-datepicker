<script lang="ts" setup>
const selectedDate = ref<[Date, Date]>([
  new Date(),
  new Date(
    new Date().getFullYear(),
    new Date().getMonth(),
    new Date().getDate() + 7,
  ),
]);
const viewDate = ref<Date>(new Date());

// watchEffect(() => {
//   console.log(viewDate.value);
// });
</script>

<template>
  <div
    class="absolute left-0 right-0 flex h-screen items-center justify-center"
  >
    <DatePicker
      v-model:highlight="selectedDate"
      v-model:viewDate="viewDate"
      picker-mode="range"
      :config="{ showWeek: true }"
    />
  </div>
</template>
