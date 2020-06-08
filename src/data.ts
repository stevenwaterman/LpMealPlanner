type Day = "MON" | "TUE" | "WED" | "THU" | "FRI" | "SAT" | "SUN";
type Slot = "BREAKFAST" | "LUNCH" | "DINNER";

type Meal = {
    day: Day;
    slot: Slot;
}

const days: Day[] = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
const slots: Slot[] = ["BREAKFAST", "LUNCH", "DINNER"];
export const meals: Meal[] = days.flatMap(day => slots.map(slot => ({day, slot})));

type Recipe = {
    name: string;
}
export const recipes: Recipe[] = [
    {name: "Cereal"},
    {name: "Sandwich"},
    {name: "Stir Fry"}
]