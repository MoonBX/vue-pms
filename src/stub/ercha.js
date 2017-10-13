var tree = [{
  title: 1,
  id: 10,
  children: [{
    title: 2,
    type: 1,
    id: 25,
    children: [{
      title: 3,
      type: 2,
      id: 35
    },{
      title: 4,
      type: 2,
      id: 45
    }]
  }]
},{
  title: 11,
  id: 101,
  children: [{
    title: 21,
    type: 1,
    id: 251,
    children: [{
      title: 31,
      type: 2,
      id: 351
    },{
      title: 41,
      type: 2,
      id: 451
    }]
  }]
}];

// 遍历单个节点
function traverseNode(node){
  if(node.id == 351){
    console.log(node)
  }
}

// 递归遍历树
function traverseTree(node){
  if (!node) {
    return;
  }

  traverseNode(node);
  if (node.children && node.children.length > 0) {
    for (var i = 0; i < node.children.length; i++) {
      traverseTree(node.children[i]);
    }
  }
}

for( var i=0; i<tree.length; i++){
  traverseTree(tree[i]);
}

