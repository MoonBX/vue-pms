export function checkFilter(filterList){
  var newObj = {};
  _.mapKeys(filterList, function(value, key) {
    if(value&&value!=""&&value!=null) {
      newObj[key] = value
    };
  });
  return newObj;
}
