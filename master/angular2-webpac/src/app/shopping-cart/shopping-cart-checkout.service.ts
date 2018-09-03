import {Injectable} from "@angular/core";

export interface ICheckoutType {
    name: string;
    pay(totalPrice:number): string;
}
export interface IDiscount {
    code:string;
    amount:number;//percentage
}
export interface ICheckout {
    checkOut(totalPrice:number):string;
}

export class DefaultCheckout implements ICheckout{
    private _checkOutType:ICheckoutType = null;
	
    set checkOutType(value:ICheckoutType) {
        this._checkOutType = value;
    }
    public checkOut(totalPrice:number) : string {
        return this._checkOutType ? this._checkOutType.pay(totalPrice) : "Please select method of payment";
    }

}