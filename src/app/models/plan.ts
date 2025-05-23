export interface Plan {
    name: string;
    price: any;
    yearlyDiscount: string;
    category: 'student' | 'professional' | 'agency';
    description: string;
    features: string[];
    popular?: boolean;
}
