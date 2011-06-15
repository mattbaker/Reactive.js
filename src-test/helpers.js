function triggerDomEvent(element, evtName) {
  var evt = document.createEvent("HTMLEvents");
  evt.initEvent(evtName, true, false);
  element.dispatchEvent(evt);
}