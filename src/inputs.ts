import {Day, Recipe, Slot} from "./data";

export const maxTime: Record<Day, number> = {
    MON: 60,
    TUE: 75,
    WED: 75,
    THU: 75,
    FRI: 90,
    SAT: 120,
    SUN: 180
}

export const caloriesMin = 1500;
export const caloriesMax = 1900;

export const mealRequired: Record<Day, Record<Slot, boolean>> = {
    MON: {
        BREAKFAST: true,
        LUNCH: true,
        STARTER: false,
        DINNER: true,
        DESSERT: false
    },
    TUE: {
        BREAKFAST: true,
        LUNCH: true,
        STARTER: false,
        DINNER: true,
        DESSERT: false
    },
    WED: {
        BREAKFAST: true,
        LUNCH: true,
        STARTER: false,
        DINNER: true,
        DESSERT: false
    },
    THU: {
        BREAKFAST: true,
        LUNCH: true,
        STARTER: false,
        DINNER: true,
        DESSERT: false
    },
    FRI: {
        BREAKFAST: true,
        LUNCH: true,
        STARTER: false,
        DINNER: true,
        DESSERT: false
    },
    SAT: {
        BREAKFAST: false,
        LUNCH: true,
        STARTER: false,
        DINNER: true,
        DESSERT: false
    },
    SUN: {
        BREAKFAST: false,
        LUNCH: true,
        STARTER: false,
        DINNER: true,
        DESSERT: false
    }
};



export const recipes: Recipe[] = [
    {
        name: "Cereal",
        allowedSlots: ["BREAKFAST"],
        calories: 254,
        time: 5,
        rating: 1,
        portions: {
            min: 1,
            max: 2.5,
            allowDecimal: true
        }
    },
    {
        name: "Avocado Toast",
        allowedSlots: ["BREAKFAST", "LUNCH"],
        calories: 189,
        time: 10,
        rating: 3,
        portions: {
            min: 2,
            max: 4,
            allowDecimal: false
        }
    },
    {
        name: "Ploughman’s sandwich",
        allowedSlots: ["LUNCH"],
        calories: 670,
        time: 10,
        rating: 2,
        portions: {
            min: 1,
            max: 1,
            allowDecimal: false
        }
    },
    {
        name: "Club sandwich",
        allowedSlots: ["LUNCH"],
        calories: 744,
        time: 20,
        rating: 3,
        portions: {
            min: 1,
            max: 1,
            allowDecimal: false
        }
    },
    {
        name: "Chicken & ham sandwich pies",
        allowedSlots: ["LUNCH", "DINNER"],
        calories: 270,
        time: 50,
        rating: 2,
        portions: {
            min: 2,
            max: 3,
            allowDecimal: false
        }
    },
    {
        name: "Asparagus Risotto",
        allowedSlots: ["LUNCH", "DINNER"],
        calories: 623,
        time: 35,
        rating: 2,
        portions: {
            min: 0.75,
            max: 1.5,
            allowDecimal: true
        }
    },
    {
        name: "Fish & Chips",
        allowedSlots: ["DINNER"],
        calories: 842,
        time: 90,
        rating: 4,
        portions: {
            min: 0.75,
            max: 1.25,
            allowDecimal: true
        }
    },
    {
        name: "Chilli con carne",
        allowedSlots: ["DINNER"],
        calories: 387,
        time: 70,
        rating: 3,
        portions: {
            min: 0.75,
            max: 1.5,
            allowDecimal: true
        }
    },
    {
        name: "Chicken & chorizo jambalaya",
        allowedSlots: ["LUNCH", "DINNER"],
        calories: 445,
        time: 55,
        rating: 3,
        portions: {
            min: 0.75,
            max: 1.5,
            allowDecimal: true
        }
    },
    {
        name: "Chocolate Brownies",
        allowedSlots: ["DESSERT"],
        calories: 144,
        time: 60,
        rating: 4,
        portions: {
            min: 2,
            max: 4,
            allowDecimal: false
        }
    },
    {
        name: "Chocolate Cake",
        allowedSlots: ["DESSERT"],
        calories: 541,
        time: 120,
        rating: 5,
        portions: {
            min: 0.7,
            max: 1.5,
            allowDecimal: true
        }
    },
    {
        name: "Spiced carrot & lentil soup",
        allowedSlots: ["LUNCH", "STARTER"],
        calories: 238,
        time: 25,
        rating: 3,
        portions: {
            min: 0.5,
            max: 2.5,
            allowDecimal: true
        }
    },
    {
        name: "Spicy root & lentil casserole",
        allowedSlots: ["DINNER"],
        calories: 378,
        time: 45,
        rating: 2,
        portions: {
            min: 0.8,
            max: 2,
            allowDecimal: true
        }
    },
    {
        name: "Red lentil, chickpea & chilli soup",
        allowedSlots: ["LUNCH", "STARTER"],
        calories: 222,
        time: 35,
        rating: 3,
        portions: {
            min: 0.5,
            max: 2.5,
            allowDecimal: true
        }
    },
    {
        name: "Store-bought Cake",
        allowedSlots: ["DESSERT"],
        calories: 229,
        time: 5,
        rating: 4,
        portions: {
            min: 1,
            max: 2,
            allowDecimal: true
        }
    },
    {
        name: "Chicken biryani",
        allowedSlots: ["DINNER"],
        time: 40,
        calories: 617,
        rating: 4,
        portions: {
            min: 0.75,
            max: 1.5,
            allowDecimal: true
        }
    },
    {
        name: "Mustard-Stuffed Chicken",
        allowedSlots: ["LUNCH", "DINNER"],
        time: 30,
        calories: 367,
        rating: 3,
        portions: {
            min: 1,
            max: 2,
            allowDecimal: false
        }
    },
    {
        name: "Victoria Sponge",
        allowedSlots: ["DESSERT"],
        calories: 558,
        time: 30,
        rating: 5,
        portions: {
            min: 0.7,
            max: 1.5,
            allowDecimal: true
        }
    },
    {
        name: "Lemon Drizzle Cake",
        allowedSlots: ["DESSERT"],
        calories: 399,
        time: 60,
        rating: 5,
        portions: {
            min: 0.7,
            max: 1.5,
            allowDecimal: true
        }
    },
    {
        name: "Churros ice cream sandwich",
        allowedSlots: ["DESSERT"],
        calories: 671,
        time: 35,
        rating: 3,
        portions: {
            min: 1,
            max: 1,
            allowDecimal: false
        }
    },
    {
        name: "Chewy chocolate chip cookies",
        allowedSlots: ["DESSERT"],
        calories: 299,
        time: 20,
        rating: 4,
        portions: {
            min: 1,
            max: 2,
            allowDecimal: false
        }
    },
]