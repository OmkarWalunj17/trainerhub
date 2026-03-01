export interface Requirement{
    requirementId?:number;
    title?:string;
    description?:string;
    department?:string;
    postedDate?:Date;
    status?:string;
    duration?:string;
    mode?:string;
    location?:string;
    skillLevel?:string;
    budget?:number;
    priority?:string;
    paymentStatus?: string;
    trainer?: {
        trainerId?:number
    }
    manager?:{
        userId:number;
    }
}