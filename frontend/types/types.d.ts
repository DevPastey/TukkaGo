import type React from "react";
import { LucideIcon } from 'lucide-react';

export type InputProps = {
  step?: string;
  label?: string;
  icon?: React.ReactElement;
  error?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;

} & React.InputHTMLAttributes<HTMLInputElement>;

export type ButtonProps = {
    disabled: boolean;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;


export type FormShape = {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
    role?: string;
};

export type LoginProps = {
    email: string;
    password: string;
};

export type categoryProp = {
    name: string;
    imageUrl: string;
    href: string;
    
}


export type AdminTabProps = {
    label: string;
    icon: LucideIcon;
    key: string;
    isActive: boolean;
    onClick: () => void;
}


export interface ProductShape {
    name: string;
    description: string;
    price: number;
    category: string;
    countInStock: number
    imageUrl: string;
    _id?: ObjectId ;
    quantity?: number ;
    isFeatured?: boolean;
}




export interface CouponShape {
    code: string; 
    discountPercentage: number;
    expirationDate: date;
    isActive: boolean;
    userId: FormShape;
}

export type CartItem = {
    _id: ObjectId;
    product: ObjectId;
    quantity: number;
    price: number;
  };


  export type ItemProps = {
    _id: ObjectId;
    imageUrl: string;
    quantity: number;
    price: number;
    name: string;
    description: string;
  };