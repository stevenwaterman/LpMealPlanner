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

type Nutrition = {
    calories: number;
}


type Recipe = {
    name: string;
    allowedMeals: Slot[];
    nutrition: Nutrition;
}
export const recipes: Recipe[] = [
    {
        name: "Cereal", allowedMeals: ["BREAKFAST"], nutrition: {
            calories: 300
        }
    },
    {
        name: "Sandwich", allowedMeals: ["LUNCH", "DINNER"], nutrition: {
            calories: 550
        }
    },
    {
        name: "Stir Fry", allowedMeals: ["LUNCH", "DINNER"], nutrition: {
            calories: 820
        }
    },
    {
        name: "Cake", allowedMeals: ["DESSERT"], nutrition: {
            calories: 435
        }
    }
]

export const nutritionRequirements = {
    calories: {
        min: 2200,
        max: 2700
    }
}