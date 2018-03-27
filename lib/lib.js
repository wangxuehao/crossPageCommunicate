window.u = window.u || {};
window.u.event = window.u.event || {}; 
window.u.event.bind = bind;
window.u.event.fire = fire;

function bind(eventType,callback){
  //绑定事件，由本页面触发
  document.addEventListener(eventType, function(e) { 
    var tempEventObj = {
      data:{
        eventType:eventType,
        eventData:e.detail
      }
    }
    callback(tempEventObj);
  })
  //绑定事件，由其他页面触发
  checkIframe(function(){
    window.addEventListener('message',function(event){
      if(event.data.eventType == eventType){
        callback(event);
      }
    },false);
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
    var iframe = document.getElementById('i71_u_event_iframe');
    var targetOrigin = '*'; 
    var eventObj = {
        eventType:eventType,
        eventData:eventData
    }
    iframe.contentWindow.postMessage(eventObj,targetOrigin); 
  }); 
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
  iframeEle.src = '//iframe.iqiyi.com:9023/iframe/iframe.html';
  iframeEle.id = 'i71_u_event_iframe';
  iframeEle.style.display = "none";
  document.body.appendChild(iframeEle);
  setTimeout(function(){
    callback();
  },300);
}