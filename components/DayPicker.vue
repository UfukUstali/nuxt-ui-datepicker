<script lang="ts" setup generic="T extends keyof Modes">
import type { Dayjs } from "dayjs";
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

const weeks = computed(() => weekNumbers(props.viewDate));

function weekNumbers(date: Date) {
  // week number from 1 to 53
  const weeks: number[] = [];
  let firstDayOfWeek = dayjs(date).startOf("month");

  // get every week of the month
  while (firstDayOfWeek.month() === date.getMonth()) {
    weeks.push(firstDayOfWeek.isoWeek());
    firstDayOfWeek = firstDayOfWeek.add(1, "week").startOf("isoWeek");
  }
  return weeks;
}

// for a given week number, get the dayjs array for that week independent of the month or year
function getWeek(weekOfYear: number) {
  const fromPrevYear = props.viewDate.getMonth() === 0 && weekOfYear > 50;
  const fromNextYear = props.viewDate.getMonth() === 11 && weekOfYear < 10;
  const year =
    fromPrevYear ? props.viewDate.getFullYear() - 1
    : fromNextYear ? props.viewDate.getFullYear() + 1
    : props.viewDate.getFullYear();

  const start = dayjs().year(year).isoWeek(weekOfYear).startOf("isoWeek");
  const week: Dayjs[] = [];
  for (let i = 0; i < 7; i++) {
    week.push(start.add(i, "day"));
  }
  return week;
}

function isEdge(day: Dayjs) {
  if (!props.highlight) {
    if (props.pickerMode === "range" && temp.value)
      return day.isSame(temp.value[0], "day");
    return false;
  }
  switch (props.pickerMode) {
    case "single": {
      return day.isSame(props.highlight as Date, "day");
    }
    case "range": {
      return (
        (
          day.isSame((props.highlight as [Date, Date])[0], "day") &&
            day.isSame((props.highlight as [Date, Date])[1], "day")
        ) ?
          "both"
        : day.isSame((props.highlight as [Date, Date])[0], "day") ? "start"
        : day.isSame((props.highlight as [Date, Date])[1], "day") ? "end"
        : false
      );
    }
    default: {
      return false;
    }
  }
}

function isHighlighted(day: Dayjs) {
  if (!props.highlight) {
    if (props.pickerMode === "range" && temp.value)
      return day.isSame(temp.value[0], "day");
    return false;
  }
  switch (props.pickerMode) {
    case "single": {
      return day.isSame(props.highlight as Date, "day");
    }
    case "range": {
      return day.isBetween(
        (props.highlight as [Date, Date])[0],
        (props.highlight as [Date, Date])[1],
        "day",
        "[]",
      );
    }
    default: {
      return false;
    }
  }
}

function buttonProps(day: Dayjs, weekIndex: number) {
  const edge = isEdge(day);
  const highlighted = isHighlighted(day);
  const today = dayjs().isSame(day, "day");

  function rounded() {
    if (!highlighted) return "";
    if (!edge) {
      if (day.day() === 0) return "rounded-r-none";
      if (day.day() === 6) return "rounded-l-none";
      return "rounded-none";
    }
    if (edge === "start") {
      if (day.day() === 6) return "";
      return "rounded-r-none";
    } else if (edge === "end") {
      if (day.day() === 0) return "";
      return "rounded-l-none";
    } else {
      return "";
    }
  }

  return {
    class: [
      "h-10 w-10 flex-1 justify-center",
      (
        (weekIndex === 0 && day.date() > 7) ||
        (weekIndex === weeks.value.length - 1 && day.date() < 21)
      ) ?
        "text-gray-400 dark:text-gray-600"
      : "",
      rounded(),
    ],
    variant:
      highlighted ?
        edge ? "solid"
        : "soft"
      : today ? "outline"
      : "ghost",
    color: highlighted || today ? "primary" : "white",
  } as const;
}

const temp = useState<[Date, undefined] | undefined>("DayPickerTemp");

function clicked(day: Dayjs) {
  switch (props.pickerMode) {
    case "single": {
      if (props.highlight && day.isSame(props.highlight as Date, "day")) {
        props.emitHighlight(undefined);
        break;
      }
      // @ts-expect-error emitHighlight always expects a Date when pickerMode is single
      props.emitHighlight(day.toDate());
      break;
    }
    case "range": {
      if (temp.value) {
        if (day.isBefore(temp.value[0])) {
          // @ts-expect-error emitHighlight always expects a [Date, Date] when pickerMode is range
          props.emitHighlight([day.toDate(), temp.value[0]]);
          temp.value = undefined;
          break;
        }
        // @ts-expect-error emitHighlight always expects a [Date, Date] when pickerMode is range
        props.emitHighlight([temp.value[0], day.toDate()]);
        temp.value = undefined;
      } else {
        if (props.highlight) {
          props.emitHighlight(undefined);
        }
        temp.value = [day.toDate(), undefined];
      }
      break;
    }
  }
}
</script>

<template>
  <div class="flex flex-col items-center">
    <div class="flex h-10 w-full items-center pb-2">
      <template v-if="props.config.showWeek">
        <div
          class="ml-10 mr-2 h-6 border-l border-gray-200 dark:border-gray-800"
        ></div
      ></template>
      <span class="flex w-10 items-center justify-center text-sm font-semibold"
        >Mo</span
      >
      <span class="flex w-10 items-center justify-center text-sm font-semibold"
        >Tu</span
      >
      <span class="flex w-10 items-center justify-center text-sm font-semibold"
        >We</span
      >
      <span class="flex w-10 items-center justify-center text-sm font-semibold"
        >Th</span
      >
      <span class="flex w-10 items-center justify-center text-sm font-semibold"
        >Fr</span
      >
      <span class="flex w-10 items-center justify-center text-sm font-semibold"
        >Sa</span
      >
      <span class="flex w-10 items-center justify-center text-sm font-semibold"
        >Su</span
      >
    </div>
    <div
      v-for="(week, weekIndex) in weeks"
      :key="week"
      class="flex items-center"
    >
      <div class="flex items-center">
        <template v-if="props.config.showWeek"
          ><div class="w-10 text-center text-xs text-gray-600">
            {{ week }}
          </div>
          <div
            class="h-6 border-l border-gray-200 pr-2 dark:border-gray-800"
          ></div
        ></template>
        <UButton
          v-for="day in getWeek(week)"
          :key="day.date()"
          :label="day.date().toString()"
          v-bind="buttonProps(day, weekIndex)"
          @click="clicked(day)"
        ></UButton>
      </div>
    </div>
  </div>
</template>
