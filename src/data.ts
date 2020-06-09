export type Day = "MON" | "TUE" | "WED" | "THU" | "FRI" | "SAT" | "SUN";
export type Slot = "BREAKFAST" | "LUNCH" | "DINNER" | "DESSERT";

export type Meal = {
    day: Day;
    slot: Slot;
    required: boolean;
    maxTime: number;
}

const maxTimeMultiplier: Record<Day, number> = {
    MON: 0.8,
    TUE: 1,
    WED: 1,
    THU: 1,
    FRI: 1.1,
    SAT: 1.5,
    SUN: 2
}

const maxTime: Record<Slot, number> = {
    BREAKFAST: 15,
    LUNCH: 30,
    DINNER: 60,
    DESSERT: 20
}

const optional: Array<[Day, Slot]> = [
    ["MON", "DESSERT"],
    ["TUE", "DESSERT"],
    ["WED", "DESSERT"],
    ["THU", "DESSERT"],
    ["FRI", "DESSERT"],
    ["SAT", "BREAKFAST"],
    ["SAT", "DESSERT"],
    ["SUN", "BREAKFAST"],
    ["SUN", "DESSERT"]
];

export const days: Day[] = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
export const slots: Slot[] = ["BREAKFAST", "LUNCH", "DINNER", "DESSERT"];
export const meals: Meal[] = days.flatMap(day => slots.map(slot => ({
    day,
    slot,
    required: optional.every(([_day, _slot]) => day !== _day || slot !== _slot),
    maxTime: maxTime[slot] * maxTimeMultiplier[day]
})));

export type Recipe = {
    name: string;
    allowedSlots: Slot[];
    calories: number;
    time: number;
    rating: 1 | 2 | 3 | 4 | 5;
}
export const recipes: Recipe[] = [
    {
        name: "Cereal", allowedSlots: ["BREAKFAST"],
        calories: 254,
        time: 5,
        rating: 1
    },
    {
        name: "Avocado Toast", allowedSlots: ["BREAKFAST", "LUNCH"],
        calories: 378,
        time: 10,
        rating: 3
    },
    {
        name: "Sandwich", allowedSlots: ["LUNCH", "DINNER"],
        calories: 511,
        time: 10,
        rating: 2
    },
    {
        name: "Stir Fry", allowedSlots: ["LUNCH", "DINNER"],
        calories: 355,
        time: 15,
        rating: 3
    },
    {
        name: "Fish & Chips", allowedSlots: ["DINNER"],
        calories: 842,
        time: 90,
        rating: 4
    },
    {
        name: "Store-bought Cake", allowedSlots: ["DESSERT"],
        calories: 229,
        time: 5,
        rating: 4
    },
    {
        name: "Homemade Cake", allowedSlots: ["DESSERT"],
        calories: 558,
        time: 30,
        rating: 5
    }
]

export const nutritionRequirements = {
    calories: {
        min: 800,
        max: 2000,
    }
}