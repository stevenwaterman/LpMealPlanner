export type Day = "MON" | "TUE" | "WED" | "THU" | "FRI" | "SAT" | "SUN";
export type Slot = "BREAKFAST" | "LUNCH" | "DINNER";

export type Meal = {
    day: Day;
    slot: Slot;
}

export const days: Day[] = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
export const slots: Slot[] = ["BREAKFAST", "LUNCH", "DINNER"];
export const meals: Meal[] = days.flatMap(day => slots.map(slot => ({day, slot})));

type Recipe = {
    name: string;
    allowedMeals: Slot[];
}
export const recipes: Recipe[] = [
    {name: "Cereal", allowedMeals: ["BREAKFAST"]},
    {name: "Sandwich", allowedMeals: ["LUNCH", "DINNER"]},
    {name: "Stir Fry", allowedMeals: ["LUNCH", "DINNER"]}
]