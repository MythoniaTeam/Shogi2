
export function ForElements(count, func){
    const array = [];
    for (let i = 0; i < count; i++){
        array.push(func(i))
    }
    return array;
}