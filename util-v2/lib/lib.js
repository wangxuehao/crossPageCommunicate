window.u = window.u || {};
window.u.event = window.u.event || {}; 
window.u.event.on = on;
window.u.event.fire = fire;
window.u.event.un = un;
/**
 * 存储事件对象
 * 类型：对象数组
 * 对象格式:
 * {
 *   type:String,
 *   listener:Function,
 *   realListener:Function
 * }
 */
var eventList=[];

/**
 * 传递listener参数时，只删除该listener的监听
 * 没有传递listener参数时，删除整个eventType的事件监听
 */
function un(type,listener){
  if(!type)
    return;
  var removeAll = !listener ? true : false;
  eventList.forEach(function(item,index){
    if(item.type == type){
      if(removeAll){
        eventList.splice(index,1);
        window.removeEventListener("storage",item.realListener);
      }else if(listener == item.listener){
        eventList.splice(index,1);
        window.removeEventListener("storage",item.realListener);
      }
    }
  });
}

function on(type,listener){
  var realListener = function(){
      /**
       * arguments[0]要在window.event之前
       * IE10下，触发storage事件时
       * arguments[0]和window.event都会有值
       * 但是，window.event中取不到key和newValue等属性
       */
      var event = arguments[0] || window.event;
      if(event.key == type && event.newValue !== ''){
        //接收到事件后，清除该条存储数据
        setLocalStorage(type,'');
        var eventData = event.newValue;
        //newValue为util_empty_data时，表示传递值为空
        if(event.newValue == 'util_empty_data'){
          eventData = '';
        }
        listener({
          type:event.key,
          data:eventData
        });
      }
  }
  var eventItem = {
     type:type,
     listener:listener,
     realListener:realListener
  }
  eventList.push(eventItem);
  window.addEventListener('storage',realListener);
}

function fire(event){
  var eventData = event.data;
  if( event.data == ''){
    eventData = 'util_empty_data';
  }
  setLocalStorage(event.type,eventData);
}

function setLocalStorage(type,data){
  localStorage.setItem(type, data);
  //非IE浏览器，需要手动触发当前页的storage事件
  if(!isIE()){
    noticeCurrentPage(type,data);
  }
}
/**
 * 在当前页触发storage事件
 * https://developer.mozilla.org/en-US/docs/Web/API/StorageEvent
 */
function noticeCurrentPage(type,data){
  var storageEvent = document.createEvent("StorageEvent");
  storageEvent.initStorageEvent('storage', false, false, type,'',data,'','');
  window.dispatchEvent(storageEvent);
}

//判断是否为IE浏览器
function isIE(){
  var _ua = navigator.userAgent.toLowerCase();
  if(/msie/.test(_ua) || /rv\:11/.test(_ua)){
    return true;
  }
  return false;
}