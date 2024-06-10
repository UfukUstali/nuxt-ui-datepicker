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

const rows = computed(() => {
  const year = props.viewDate.getFullYear();
  return [
    [year - 4, year - 3, year - 2],
    [year - 1, year, year + 1],
    [year + 2, year + 3, year + 4],
  ];
});

function isEdge(year: number) {
  if (!props.highlight) return false;
  switch (props.pickerMode) {
    case "single": {
      return dayjs(props.viewDate)
        .year(year)
        .isSame(dayjs(props.highlight as Date), "year");
    }
    case "range": {
      return (
        (
          dayjs(props.viewDate)
            .year(year)
            .isSame(dayjs((props.highlight as [Date, Date])[0]), "year") &&
            dayjs(props.viewDate)
              .year(year)
              .isSame(dayjs((props.highlight as [Date, Date])[1]), "year")
        ) ?
          "both"
        : (
          dayjs(props.viewDate)
            .year(year)
            .isSame(dayjs((props.highlight as [Date, Date])[0]), "year")
        ) ?
          "start"
        : (
          dayjs(props.viewDate)
            .year(year)
            .isSame(dayjs((props.highlight as [Date, Date])[1]), "year")
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

function isHighlighted(year: number) {
  if (!props.highlight) return false;
  switch (props.pickerMode) {
    case "single": {
      return dayjs(props.viewDate)
        .year(year)
        .isSame(dayjs(props.highlight as Date), "year");
    }
    case "range": {
      return dayjs(props.viewDate)
        .year(year)
        .isBetween(
          dayjs((props.highlight as [Date, Date])[0]),
          dayjs((props.highlight as [Date, Date])[1]),
          "year",
          "[]",
        );
    }
    default: {
      return false;
    }
  }
}

function buttonProps(year: number, index: number) {
  const edge = isEdge(year);
  const highlighted = isHighlighted(year);
  const thisYear = new Date().getFullYear() === year;

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
      : thisYear ? "outline"
      : "ghost",
    color: highlighted || thisYear ? "primary" : "white",
  } as const;
}
function clicked(year: number) {
  const date = new Date(props.viewDate);
  date.setFullYear(year);
  props.emitViewDate(date);
}
</script>

<template>
  <div class="flex flex-col items-center">
    <div
      v-for="(years, rowIndex) in rows"
      :key="rowIndex"
      class="flex items-center"
    >
      <div class="flex items-center">
        <UButton
          v-for="(year, index) in years"
          :key="year"
          :label="year.toString()"
          v-bind="buttonProps(year, index)"
          @click="clicked(year)"
        ></UButton>
      </div>
    </div>
  </div>
</template>
