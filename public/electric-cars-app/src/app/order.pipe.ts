import { Pipe, PipeTransform } from '@angular/core';

// @Pipe({
//   name: 'order'
// })
// export class OrderPipe implements PipeTransform {

//   transform(value: unknown, ...args: unknown[]): unknown {

//     if (!isNaN(value as number)) {
//       const listSignificantDigit= (value as number) % 10;
//       let postFix= "th";
//       switch(listSignificantDigit) {
//         case 1:
//           postFix= "st";
//           break;
//         case 2:
//           postFix= "nd";
//           break;
//         default:
//           postFix= "th";
//       }
//       return value+postFix;
//     }
//   }

// }
