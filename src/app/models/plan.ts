export interface Plan {
    name: string;
    price: number;
    yearlyDiscount: string;
    category: 'student' | 'professional' | 'agency';
    description: string;
    features: string[];
    popular?: boolean;
}
