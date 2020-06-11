export type Day = "MON" | "TUE" | "WED" | "THU" | "FRI" | "SAT" | "SUN";
export const days: Day[] = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

export type Slot = "BREAKFAST" | "LUNCH" | "STARTER" | "DINNER" | "DESSERT";
export const slots: Slot[] = ["BREAKFAST", "LUNCH", "STARTER", "DINNER", "DESSERT"];

export type Recipe = {
    name: string;
    allowedSlots: Slot[];
    calories: number;
    time: number;
    rating: 1 | 2 | 3 | 4 | 5;
    portions: {
        min: number,
        max: number,
        allowDecimal: boolean
    }
}
