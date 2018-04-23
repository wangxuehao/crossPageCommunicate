window.u = window.u || {};
window.u.event = window.u.event || {}; 
window.u.event.bind = bind;
window.u.event.fire = fire;
window.u.event.unbind = unbind;
/**
 * 存储事件对象
 * 类型：对象数组
 * 对象格式：
 * {
 *   eventType:String,
 *   ordinaryHandler:Function,
 *   messageHandler:Function
 * }
 */
window.u.event.eventList=[];

function unbind(eventType){
  if(!eventType)
    return;
  var eventList = window.u.event.eventList;
  eventList.forEach(function(item,index){
    if(item.eventType == eventType){
      var ordinaryHandler = item.ordinaryHandler;
      var messageHandler = item.messageHandler;
      eventList.slice(index,1);
      document.removeEventListener(eventType,ordinaryHandler);
      window.removeEventListener("message",messageHandler);
    }
  });
}

function bind(eventType,callback){
  var eventList = window.u.event.eventList;
  var ordinaryHandler = function(){
    var event = window.event || arguments[0];
    var tempEventObj = {
      data:{
        eventType:eventType,
        eventData:event.detail
      }
    }
    callback(tempEventObj);
  }
  var messageHandler = function(){
      var event = window.event || arguments[0];
      if(event.data.eventType == eventType){
        //接收到事件后，清除该条存储数据
        var tempEvent = {
          eventType:eventType,
          eventData:''
        };
        setLocalStorage(tempEvent);
        callback(event);
      }
  }
  var eventItem = {
     eventType:eventType,
     ordinaryHandler:ordinaryHandler,
     messageHandler:messageHandler
  }
  eventList.push(eventItem);
  document.addEventListener(eventType,ordinaryHandler);
  checkIframe(function(){
    window.addEventListener('message',messageHandler);
  });
}

function fire(event){
  var eventType = event.eventType;
  var eventData = event.eventData;
  //触发本页面该事件
  var tempEvent = new CustomEvent(eventType, {"detail":eventData})
  document.dispatchEvent(tempEvent)
  //触发其他页面该事件
  checkIframe(function(){
    var tempEventObj = {
      eventType:eventType,
      eventData:''
    };
    //存储storage数据前先将该条item置空。
    setLocalStorage(tempEventObj);
    setLocalStorage(event);
  }); 
}

function setLocalStorage(event){
  var eventType = event.eventType;
  var eventData = event.eventData;
  var iframe = document.getElementById('i71_u_event_iframe');
  var targetOrigin = '*'; 
  var eventObj = {
      eventType:eventType,
      eventData:eventData
  }
  iframe.contentWindow.postMessage(eventObj,targetOrigin); 
}

function checkIframe(callback){
  if(hasLoadIframe()){
    callback();
  }else{
    appendIframe(function(){
      callback();
    });
  }
}

function hasLoadIframe(){
  var iframe = document.getElementById('i71_u_event_iframe');
  if(iframe){
    return true;
  }else{
    return false;
  }
}

function appendIframe(callback){
  var iframeEle = document.createElement('iframe');
  iframeEle.src = '//iframe.iqiyi.com:9023/util-v1/iframe/iframe.html';
  iframeEle.id = 'i71_u_event_iframe';
  iframeEle.style.display = "none";
  document.body.appendChild(iframeEle);
  setTimeout(function(){
    callback();
  },300);
}