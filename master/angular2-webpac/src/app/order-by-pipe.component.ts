import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
 name: 'orderBy'
})
export class OrderBy{

	transform(array, orderBy, asc = true) {
		if (!orderBy || '' === orderBy.trim()) {
		   return array;
		}
		let temp = [];
		if (asc) {
			temp = array.sort((item1: any, item2: any) => { 
				let a = item1[orderBy];
				let b = item2[orderBy];
				return this.orderByComparator(a, b);
			});
		} else {
			temp = array.sort((item1: any, item2: any) => { 
				let a = item1[orderBy];
				let b = item2[orderBy]; 
				return this.orderByComparator(b, a);
			});
		}
		return temp;
	}
 
	orderByComparator(a:any, b:any):number {
		if((isNaN(parseFloat(a)) || !isFinite(a)) || (isNaN(parseFloat(b)) || !isFinite(b))){
		   if(a.toLowerCase() < b.toLowerCase()) return -1;
		   if(a.toLowerCase() > b.toLowerCase()) return 1;
		} else {
		   if(parseFloat(a) < parseFloat(b)) return -1;
		   if(parseFloat(a) > parseFloat(b)) return 1;
		}
		return 0;
	}
}