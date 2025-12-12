const generateRandIndex = (array, index) => {
  const randomIndex = Number(
    Math.random().toString().split(".")[1].split("")[1] +
      Math.random().toString().split(".")[1].split("")[3] +
      Math.random().toString().split(".")[1].split("")[5] +
      Math.random().toString().split(".")[1].split("")[7]
  );
  const isValid = array.filter(function (el) {
    el.index == randomIndex;
  })[0];
  if (isValid) {
    return generateRandIndex(array);
  } else {
    return randomIndex;
  }
};

const shuffleArray = (array, twoVtwo) => {
  let newArray = [];
  let finalArray = [];
  array.forEach((element, index) => {
    const item = {
      item: element,
      index: generateRandIndex(array, index),
    };
    // console.log(item)
    newArray.push(item);
  });
  newArray = newArray.sort((a, b) => b.index - a.index);
  newArray.forEach((element) => {
    finalArray.push(element.item);
  });
  if(twoVtwo){
     finalArray = finalArray.map((el, index) => {
       if (index == 0) {
         return {
           player: el,
           partner: finalArray[2],
         };
       } else if (index == 1) {
         return {
           player: el,
           partner: finalArray[3],
         };
       } else if (index == 2) {
         return {
           player: el,
           partner: finalArray[0],
         };
       } else if (index == 3) {
         return {
           player: el,
           partner: finalArray[1],
         };
       }
     });
     return finalArray
  }else{
     return finalArray;
  }
};

export default shuffleArray;
