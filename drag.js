//-----Click and Drag/Swipe behavior for UI Cards------//

document.querySelectorAll('.card').forEach(e=>{
  var object = e,
  initX, initY, firstX, firstY;
  object.addEventListener('mousedown', function(e) {
    if(e.target.classList.contains('play')){toggleDemo()}
    e.preventDefault();
    initX = this.offsetLeft;
    initY = this.offsetTop;
    firstX = e.pageX;
    firstY = e.pageY;
    
    this.addEventListener('mousemove', dragIt, false);

    window.addEventListener('mouseup', function() {
      object.removeEventListener('mousemove', dragIt, false);
      dragEnd()
    }, false);

  }, false);

  object.addEventListener('touchstart', function(e) {
    if(e.target.classList.contains('play')){toggleDemo()}
    e.preventDefault();
    initX = this.offsetLeft;
    initY = this.offsetTop;
    var touch = e.touches;
    firstX = touch[0].pageX;
    firstY = touch[0].pageY;
    
    
    this.addEventListener('touchmove', swipeIt, false);

    window.addEventListener('touchend', function(e) {
      e.preventDefault();
      object.removeEventListener('touchmove', swipeIt, false);
      dragEnd()
    }, false);

  }, false);

  function dragIt(e) {
    object.style.transition = "0s"
    document.querySelectorAll('.dragSelected').forEach(e=>{e.classList.remove('dragSelected')})
    object.classList.add('dragSelected')
    this.style.left = initX+e.pageX-firstX + 'px';
    this.style.top = initY+e.pageY-firstY + 'px';
  }
  
  function dragEnd() {
    object.style.transition = ""
  }
  
  function swipeIt(e) {
    object.style.transition = "0s"
    var contact = e.touches;
    this.style.left = initX+contact[0].pageX-firstX + 'px';
    this.style.top = initY+contact[0].pageY-firstY + 'px';
  }
  
})


