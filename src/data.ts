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


export type Recipe = {
    name: string;
    allowedMeals: Slot[];
    nutrition: Nutrition;
}
export const recipes: Recipe[] = [
    {
        name: "Cereal", allowedMeals: ["BREAKFAST"], nutrition: {
            calories: 254
        }
    },
    {
        name: "Avocado Toast", allowedMeals: ["BREAKFAST", "LUNCH"], nutrition: {
            calories: 378
        }
    },
    {
        name: "Sandwich", allowedMeals: ["LUNCH", "DINNER"], nutrition: {
            calories: 511
        }
    },
    {
        name: "Stir Fry", allowedMeals: ["LUNCH", "DINNER"], nutrition: {
            calories: 355
        }
    },
    {
        name: "Fish & Chips", allowedMeals: ["DINNER"], nutrition: {
            calories: 842
        }
    },
    {
        name: "Cake", allowedMeals: ["DESSERT"], nutrition: {
            calories: 229
        }
    }
]

export const nutritionRequirements = {
    calories: {
        min: 800,
        max: 1200,
    }
}