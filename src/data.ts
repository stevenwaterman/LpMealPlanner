export type Day = "MON" | "TUE" | "WED" | "THU" | "FRI" | "SAT" | "SUN";
export type Slot = "BREAKFAST" | "LUNCH" | "STARTER" | "DINNER" | "DESSERT";

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
    STARTER: 15,
    DINNER: 60,
    DESSERT: 20
}

const optional: Array<[Day, Slot]> = [
    ["MON", "STARTER"],
    ["MON", "DESSERT"],
    ["TUE", "STARTER"],
    ["TUE", "DESSERT"],
    ["WED", "STARTER"],
    ["WED", "DESSERT"],
    ["THU", "STARTER"],
    ["THU", "DESSERT"],
    ["FRI", "STARTER"],
    ["FRI", "DESSERT"],
    ["SAT", "BREAKFAST"],
    ["SAT", "STARTER"],
    ["SAT", "DESSERT"],
    ["SUN", "BREAKFAST"],
    ["SUN", "STARTER"],
    ["SUN", "DESSERT"]
];

export const days: Day[] = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
export const slots: Slot[] = ["BREAKFAST", "LUNCH", "STARTER", "DINNER", "DESSERT"];
export const meals: Meal[] = days.flatMap(day => slots.map(slot => ({
    day,
    slot,
    required: optional.every(([_day, _slot]) => day !== _day || slot !== _slot),
    maxTime: maxTime[slot] * maxTimeMultiplier[day]
})));

export const nutritionRequirements = {
    calories: {
        min: 800,
        max: 2000,
    }
}

export type Recipe = {
    name: string;
    allowedSlots: Slot[];
    calories: number;
    time: number;
    rating: 1 | 2 | 3 | 4 | 5;
}
export const recipes: Recipe[] = [
    {
        name: "Cereal",
        allowedSlots: ["BREAKFAST"],
        calories: 254,
        time: 5,
        rating: 1
    },
    {
        name: "Avocado Toast",
        allowedSlots: ["BREAKFAST", "LUNCH"],
        calories: 378,
        time: 10,
        rating: 3
    },
    {
        name: "Ploughman’s sandwich",
        allowedSlots: ["LUNCH"],
        calories: 670,
        time: 10,
        rating: 2
    },
    {
        name: "Club sandwich",
        allowedSlots: ["LUNCH"],
        calories: 744,
        time: 20,
        rating: 3
    },
    {
        name: "Chicken & ham sandwich pies",
        allowedSlots: ["LUNCH", "DINNER"],
        calories: 540,
        time: 50,
        rating: 2
    },
    {
        name: "Asparagus Risotto",
        allowedSlots: ["LUNCH", "DINNER"],
        calories: 623,
        time: 35,
        rating: 2
    },
    {
        name: "Fish & Chips",
        allowedSlots: ["DINNER"],
        calories: 842,
        time: 90,
        rating: 4
    },
    {
        name: "Chilli con carne",
        allowedSlots: ["DINNER"],
        calories: 387,
        time: 70,
        rating: 3
    },
    {
        name: "Chicken & chorizo jambalaya",
        allowedSlots: ["LUNCH", "DINNER"],
        calories: 445,
        time: 55,
        rating: 3
    },
    {
        name: "Chocolate Brownies",
        allowedSlots: ["DESSERT"],
        calories: 144,
        time: 60,
        rating: 4
    },
    {
        name: "Chocolate Cake",
        allowedSlots: ["DESSERT"],
        calories: 541,
        time: 120,
        rating: 5
    },
    {
        name: "Spiced carrot & lentil soup",
        allowedSlots: ["LUNCH", "STARTER"],
        calories: 238,
        time: 25,
        rating: 3
    },
    {
        name: "Spicy root & lentil casserole",
        allowedSlots: ["DINNER"],
        calories: 378,
        time: 45,
        rating: 2
    },
    {
        name: "Red lentil, chickpea & chilli soup",
        allowedSlots: ["LUNCH", "STARTER"],
        calories: 222,
        time: 35,
        rating: 3
    },
    {
        name: "Store-bought Cake",
        allowedSlots: ["DESSERT"],
        calories: 229,
        time: 5,
        rating: 4
    },
    {
        name: "Chicken biryani",
        allowedSlots: ["DINNER"],
        time: 40,
        calories: 617,
        rating: 4
    },
    {
        name: "Mustard-Stuffed Chicken",
        allowedSlots: ["LUNCH", "DINNER"],
        time: 30,
        calories: 367,
        rating: 3
    },
    {
        name: "Victoria Sponge",
        allowedSlots: ["DESSERT"],
        calories: 558,
        time: 30,
        rating: 5
    },
    {
        name: "Lemon Drizzle Cake",
        allowedSlots: ["DESSERT"],
        calories: 399,
        time: 60,
        rating: 5
    },
    {
        name: "Churros ice cream sandwich",
        allowedSlots: ["DESSERT"],
        calories: 671,
        time: 35,
        rating: 3
    },
    {
        name: "Chewy chocolate chip cookies",
        allowedSlots: ["DESSERT"],
        calories: 299,
        time: 20,
        rating: 4
    },
]

