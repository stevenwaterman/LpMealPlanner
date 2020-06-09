export type Day = "MON" | "TUE" | "WED" | "THU" | "FRI" | "SAT" | "SUN";
export type Slot = "BREAKFAST" | "LUNCH" | "STARTER" | "DINNER" | "DESSERT";

export type Meal = {
    day: Day;
    slot: Slot;
    required: boolean;
}

export const maxTime: Record<Day, number> = {
    MON: 60,
    TUE: 75,
    WED: 75,
    THU: 75,
    FRI: 90,
    SAT: 120,
    SUN: 180
}

export const nutritionRequirements = {
    calories: {
        week: {
            min: 2000 * 7,
            max: 2200 * 7,
        },
        day: {
            min: 1700,
            max: 2500
        }
    }
}

export const days: Day[] = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
export function previousDay(day: Day): Day | undefined {
    return days[days.indexOf(day) - 1];
}
export const slots: Slot[] = ["BREAKFAST", "LUNCH", "STARTER", "DINNER", "DESSERT"];
export const meals: Meal[] = [
    { day: "MON", slot: "BREAKFAST", required: true },
    { day: "MON", slot: "LUNCH", required: true },
    { day: "MON", slot: "STARTER", required: false },
    { day: "MON", slot: "DINNER", required: true },
    { day: "MON", slot: "DESSERT", required: false },

    { day: "TUE", slot: "BREAKFAST", required: true },
    { day: "TUE", slot: "LUNCH", required: true },
    { day: "TUE", slot: "STARTER", required: false },
    { day: "TUE", slot: "DINNER", required: true },
    { day: "TUE", slot: "DESSERT", required: false },

    { day: "WED", slot: "BREAKFAST", required: true },
    { day: "WED", slot: "LUNCH", required: true },
    { day: "WED", slot: "STARTER", required: false },
    { day: "WED", slot: "DINNER", required: true },
    { day: "WED", slot: "DESSERT", required: false },

    { day: "THU", slot: "BREAKFAST", required: true },
    { day: "THU", slot: "LUNCH", required: true },
    { day: "THU", slot: "STARTER", required: false },
    { day: "THU", slot: "DINNER", required: true },
    { day: "THU", slot: "DESSERT", required: false },

    { day: "FRI", slot: "BREAKFAST", required: true },
    { day: "FRI", slot: "LUNCH", required: true },
    { day: "FRI", slot: "STARTER", required: false },
    { day: "FRI", slot: "DINNER", required: true },
    { day: "FRI", slot: "DESSERT", required: false },

    { day: "SAT", slot: "BREAKFAST", required: false },
    { day: "SAT", slot: "LUNCH", required: true },
    { day: "SAT", slot: "STARTER", required: false },
    { day: "SAT", slot: "DINNER", required: true },
    { day: "SAT", slot: "DESSERT", required: false },

    { day: "SUN", slot: "BREAKFAST", required: false },
    { day: "SUN", slot: "LUNCH", required: true },
    { day: "SUN", slot: "STARTER", required: false },
    { day: "SUN", slot: "DINNER", required: true },
    { day: "SUN", slot: "DESSERT", required: false },
]



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

