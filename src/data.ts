export type Day = "MON" | "TUE" | "WED" | "THU" | "FRI" | "SAT" | "SUN";
export type Slot = "BREAKFAST" | "LUNCH" | "DINNER" | "DESSERT";

export type Meal = {
    day: Day;
    slot: Slot;
}

type SlotRequirements = {
    required: boolean;
}

export const slotRequirements: Record<Slot, SlotRequirements> = {
    BREAKFAST: {
        required: true
    },
    LUNCH: {
        required: true
    },
    DINNER: {
        required: true
    },
    DESSERT: {
        required: false
    }
}

export const days: Day[] = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
export const slots: Slot[] = ["BREAKFAST", "LUNCH", "DINNER", "DESSERT"];
export const meals: Meal[] = days.flatMap(day => slots.map(slot => ({day, slot})));

type Recipe = {
    name: string;
    allowedMeals: Slot[];
}
export const recipes: Recipe[] = [
    {name: "Cereal", allowedMeals: ["BREAKFAST"]},
    {name: "Sandwich", allowedMeals: ["LUNCH", "DINNER"]},
    {name: "Stir Fry", allowedMeals: ["LUNCH", "DINNER"]},
    {name: "Cake", allowedMeals: ["DESSERT"]}
]