export interface Feedback{
    feedbackId?:number;
    user?: { userId: number };
    trainer?: { trainerId: number };
    category:string;
    feedbackText:string;
    date:Date;
}