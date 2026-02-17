export interface Activity{
    time:string;
    title:string;
    description:string;
    location:string;
}

export interface DayPlan{
    day_number:number;
    theme:string;
    activities:Activity[];
}

export interface Itinerary{
    trip_title:string;
    destination:string;
    duration:number;
    budget_tag:string;
    days:DayPlan[];
}