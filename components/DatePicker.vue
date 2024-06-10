<script lang="ts" setup generic="T extends keyof Modes">
import type { Modes } from "@/types";
import { DayPicker, MonthPicker, YearPicker } from "#components";

const dayjs = useDayjs();

const props = defineProps<{
  pickerMode: T;
  highlight: Modes[T];
  viewDate: Date;
  config?: {
    showWeek?: boolean;
  };
}>();

const emit = defineEmits<{
  "update:highlight": [Modes[T]];
  "update:viewDate": [Date];
}>();

type TimeMode = "Day" | "Month" | "Year";

const mode = ref<TimeMode>("Day");

const componentTransition = ref<"left" | "right">("left");

const componentKey = ref(0);

const componentProps = computed(() => {
  return {
    pickerMode: props.pickerMode,
    viewDate: props.viewDate,
    emitViewDate: (date: Date) => {
      emit("update:viewDate", date);
      headerProps.value.prevMode();
    },
    highlight: props.highlight,
    emitHighlight: (highlight: Modes[T]) => emit("update:highlight", highlight),
    config: {
      showWeek: props.config?.showWeek ?? true,
    },
  };
});

// eslint-disable-next-line vue/return-in-computed-property
const currentComponent = computed(() => {
  switch (mode.value) {
    case "Day":
      return DayPicker;
    case "Month":
      return MonthPicker;
    case "Year":
      return YearPicker;
  }
});

// eslint-disable-next-line vue/return-in-computed-property
const headerProps = computed(() => {
  switch (mode.value) {
    case "Year":
      return {
        mode: "Year" as const,
        title: `${props.viewDate.getFullYear() - 4} - ${props.viewDate.getFullYear() + 4}`,
        nextMode: () => {
          mode.value = "Year";
        },
        prevMode: () => {
          mode.value = "Month";
        },
        next: () => {
          componentTransition.value = "left";
          emit(
            "update:viewDate",
            new Date(props.viewDate.getFullYear() + 9, 0),
          );
          componentKey.value++;
        },
        prev: () => {
          componentTransition.value = "right";
          emit(
            "update:viewDate",
            new Date(props.viewDate.getFullYear() - 9, 0),
          );
          componentKey.value++;
        },
      };
    case "Month":
      return {
        mode: "Month" as const,
        title: `${props.viewDate.getFullYear()}`,
        nextMode: () => {
          mode.value = "Year";
        },
        prevMode: () => {
          mode.value = "Day";
        },
        next: () => {
          componentTransition.value = "left";
          emit(
            "update:viewDate",
            new Date(props.viewDate.getFullYear() + 1, 0),
          );
          componentKey.value++;
        },
        prev: () => {
          componentTransition.value = "right";
          emit(
            "update:viewDate",
            new Date(props.viewDate.getFullYear() - 1, 0),
          );
          componentKey.value++;
        },
      };
    case "Day":
      return {
        mode: "Day" as const,
        title: `${dayjs(props.viewDate).format("MMMM YYYY")}`,
        nextMode: () => {
          mode.value = "Month";
        },
        prevMode: () => {
          mode.value = "Day";
        },
        next: () => {
          componentTransition.value = "left";
          emit(
            "update:viewDate",
            new Date(
              props.viewDate.getFullYear(),
              props.viewDate.getMonth() + 1,
            ),
          );
          componentKey.value++;
        },
        prev: () => {
          componentTransition.value = "right";
          emit(
            "update:viewDate",
            new Date(
              props.viewDate.getFullYear(),
              props.viewDate.getMonth() - 1,
            ),
          );
          componentKey.value++;
        },
      };
  }
});

const transition = ref<"up" | "down">("up");

const key = ref(0);

watch(mode, (newMode, oldMode) => {
  if (newMode === "Year") {
    transition.value = "down";
  } else if (newMode === "Day") {
    transition.value = "up";
  } else if (oldMode === "Year") {
    transition.value = "up";
  } else if (oldMode === "Day") {
    transition.value = "down";
  }
  key.value++;
});

const swipeEl = ref<HTMLElement | undefined>();

const { isSwiping, direction } = useSwipe(swipeEl);

watch(
  () => isSwiping.value,
  () => {
    if (isSwiping.value) {
      switch (direction.value) {
        case "left":
          headerProps.value.next();
          break;
        case "right":
          headerProps.value.prev();
          break;
      }
    }
  },
);
</script>

<template>
  <div
    class="flex flex-col items-center gap-4 rounded-lg border border-gray-600 p-3"
  >
    <slot name="header" :header-props>
      <div class="flex w-full items-center justify-between">
        <UButton
          square
          size="lg"
          icon="i-heroicons-chevron-left-20-solid"
          @click="headerProps.prev()"
        />
        <UButton
          size="lg"
          color="white"
          variant="ghost"
          class="py-0 text-lg font-bold"
          @click="headerProps.nextMode()"
          >{{ headerProps.title }}</UButton
        >
        <UButton
          square
          size="lg"
          icon="i-heroicons-chevron-right-20-solid"
          @click="headerProps.next()"
        />
      </div>
    </slot>
    <div ref="swipeEl">
      <Transition mode="out-in" :name="transition">
        <div :key>
          <Transition mode="out-in" :name="componentTransition">
            <div :key="componentKey">
              <component
                :is="currentComponent"
                v-bind="componentProps"
              ></component>
            </div>
          </Transition>
        </div>
      </Transition>
    </div>
  </div>
</template>

<style scoped>
.up-enter-active,
.up-leave-active {
  transition: all 0.25s ease-out;
}

.up-enter-from {
  opacity: 0;
  transform: translateY(30px);
}

.up-leave-to {
  opacity: 0;
  transform: translateY(-30px);
}

.down-enter-active,
.down-leave-active {
  transition: all 0.25s ease-out;
}

.down-enter-from {
  opacity: 0;
  transform: translateY(-30px);
}

.down-leave-to {
  opacity: 0;
  transform: translateY(30px);
}
.right-enter-from,
.left-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}
.left-enter-from,
.right-leave-to {
  opacity: 0;
  transform: translateX(20px);
}
.right-leave-from,
.right-enter-to,
.left-leave-from,
.left-enter-to {
  opacity: 1;
}
.right-leave-active,
.right-enter-active,
.left-leave-active,
.left-enter-active {
  transition: all 0.2s;
}
</style>
