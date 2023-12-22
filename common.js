let obj={};
obj.getItems=function(store){
  if(localStorage.getItem(store) != null){
    return JSON.parse(localStorage.getItem(store));
}else{
return [];
}
}
obj.localStorageManage=function(store,action=3,data,id){
   let status=false;
    if(action == 0){
      if(localStorage.getItem(store) != null){
          let items=JSON.parse(localStorage.getItem(store));
          let lastIdAdded=items.map(function(el){
            return el.id;
          }).sort(function(a,b){return a - b });
            data["id"]=parseInt(lastIdAdded[lastIdAdded.length-1])+1 || 0;
            items.push(data);
            localStorage.setItem(store,JSON.stringify(items));
            status=true;
        }else{
          let items=[];
          data["id"]=0;
          items.push(data);
          localStorage.setItem(store,JSON.stringify(items));
          status=true;
        }
        return status;
    }else if(action == 1){
  if(localStorage.getItem(store) != null){
          let items=JSON.parse(localStorage.getItem(store));
          let newItems=items.filter(function(el){
            if(el.id != id){
              return el;
            }
          });
          localStorage.setItem(store,JSON.stringify(newItems));
        }else{
          return "no store with this name";
        }
    }else if(action == 2){
      if(localStorage.getItem(store) != null){
          let items=JSON.parse(localStorage.getItem(store));
          let newItems=items.filter(function(el){
            if(el.id == id){
              el.employeeId=data.employeeId;
              el.date=new Date(data.date);
              el.note=data.note;
              return el;
            }else{
              return el;
            }
          });
          localStorage.setItem(store,JSON.stringify(newItems));
        }else{
          return "no store with this name";
        }
    }else if(action == 3){
      if(localStorage.getItem(store) != null){
              let items=JSON.parse(localStorage.getItem(store));
              let newItems=items.filter(function(el){
                if(el.id == id){
                  return el;
                }
              });
              //localStorage.setItem(store,JSON.stringify(newItems));
              return newItems;
            }else{
              return "no store with this name";
            }
        }
  }

