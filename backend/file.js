const arr=[1,2,3,4,1,3,6,5];

let obj={};

for(let i=0;i<arr.length;i++){
   if(obj[arr[i]>1]){
    console.log('the arr contains the duplicate elemnts');
    break;
   }
   else {
    obj[arr[i]]++;
   }
}