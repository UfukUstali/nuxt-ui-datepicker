<script lang="ts" setup generic="T extends keyof Modes">
import type { Modes } from "@@/types";

const props = defineProps<{
  pickerMode: T;
  viewDate: Date;
  emitViewDate: (date: Date) => void;
  highlight: Modes[T];
  emitHighlight: (highlight: Modes[T]) => void;
  config: {
    showWeek: boolean;
  };
}>();

const dayjs = useDayjs();

type Month = {
  name: string;
  index: number;
};

const quarters = [
  [
    { name: "January", index: 0 },
    { name: "February", index: 1 },
    { name: "March", index: 2 },
  ],
  [
    { name: "April", index: 3 },
    { name: "May", index: 4 },
    { name: "June", index: 5 },
  ],
  [
    { name: "July", index: 6 },
    { name: "August", index: 7 },
    { name: "September", index: 8 },
  ],
  [
    { name: "October", index: 9 },
    { name: "November", index: 10 },
    { name: "December", index: 11 },
  ],
];

function isEdge(month: Month) {
  if (!props.highlight) return false;
  switch (props.pickerMode) {
    case "single": {
      return dayjs(props.viewDate)
        .month(month.index)
        .isSame(dayjs(props.highlight as Date), "month");
    }
    case "range": {
      return (
        (
          dayjs(props.viewDate)
            .month(month.index)
            .isSame(dayjs((props.highlight as [Date, Date])[0]), "month") &&
            dayjs(props.viewDate)
              .month(month.index)
              .isSame(dayjs((props.highlight as [Date, Date])[1]), "month")
        ) ?
          "both"
        : (
          dayjs(props.viewDate)
            .month(month.index)
            .isSame(dayjs((props.highlight as [Date, Date])[0]), "month")
        ) ?
          "start"
        : (
          dayjs(props.viewDate)
            .month(month.index)
            .isSame(dayjs((props.highlight as [Date, Date])[1]), "month")
        ) ?
          "end"
        : false
      );
    }
    default: {
      return false;
    }
  }
}

function isHighlighted(month: Month) {
  if (!props.highlight) return false;
  switch (props.pickerMode) {
    case "single": {
      return dayjs(props.viewDate)
        .month(month.index)
        .isSame(dayjs(props.highlight as Date), "month");
    }
    case "range": {
      return dayjs(props.viewDate)
        .month(month.index)
        .isBetween(
          dayjs((props.highlight as [Date, Date])[0]),
          dayjs((props.highlight as [Date, Date])[1]),
          "month",
          "[]",
        );
    }
    default: {
      return false;
    }
  }
}

function buttonProps(month: Month, index: number) {
  const edge = isEdge(month);
  const highlighted = isHighlighted(month);
  const thisMonth =
    new Date().getMonth() === month.index &&
    new Date().getFullYear() === props.viewDate.getFullYear();

  function rounded() {
    if (!highlighted) return "";
    if (!edge) {
      if (index === 0) return "rounded-r-none";
      if (index === 2) return "rounded-l-none";
      return "rounded-none";
    }
    if (edge === "start") {
      if (index === 2) return "";
      return "rounded-r-none";
    } else if (edge === "end") {
      if (index === 0) return "";
      return "rounded-l-none";
    } else {
      return "";
    }
  }

  return {
    class: ["h-10 w-28 flex-1 justify-center", rounded()],
    variant:
      highlighted ?
        edge ? "solid"
        : "soft"
      : thisMonth ? "outline"
      : "ghost",
    color: highlighted || thisMonth ? "primary" : "white",
  } as const;
}

function clicked(month: Month) {
  const date = new Date(props.viewDate);
  date.setMonth(month.index);
  props.emitViewDate(date);
}
</script>

<template>
  <div class="flex flex-col items-center">
    <div
      v-for="(months, quarterIndex) in quarters"
      :key="quarterIndex"
      class="flex items-center"
    >
      <div class="flex items-center">
        <UButton
          v-for="(month, index) in months"
          :key="month.index"
          :label="month.name"
          v-bind="buttonProps(month, index)"
          @click="clicked(month)"
        ></UButton>
      </div>
    </div>
  </div>
</template>
