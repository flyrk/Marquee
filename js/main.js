MPC.addEvent(window, 'load', function() {
  var prevBtn = document.getElementsByClassName('arrow-left')[0],
      nextBtn = document.getElementsByClassName('arrow-right')[0],
      loopContainer = document.getElementsByClassName('loop-container')[0],
      btns = document.getElementsByClassName('buttons')[0],
      wrap = document.getElementsByClassName('wrap')[0];
  var stopFlag = 0;

  function startInterval() {
    maq.timer = setTimeout(function () {
      // console.log(stopFlag);
      if (!stopFlag) {
        maq.changePhoto(-600);
        startInterval();
      } else {
        clearTimeout(maq.timer);
      }
    }, 4500);
  }

  function Marquee() {
    this.timer = 0;
    this.index = 0;
  }

  Marquee.prototype.animate = function (aimLeft) {
    var curLeft = parseInt(loopContainer.style.left) || -600,
        speed = (aimLeft - curLeft) / 20, 
        delay = 20,
        self = this;
    var time = setInterval(function () {
      curLeft += speed;
      loopContainer.style.left = curLeft + 'px';
      if (curLeft === aimLeft) {
        clearInterval(time);
        if (aimLeft <= -3600) {
          loopContainer.style.left = '-600px';
        }
        if (aimLeft >= 0) {
          loopContainer.style.left = '-3000px';
        }
        self.showCurrentDot();
      }
    }, delay);
  };
  Marquee.prototype.showCurrentDot = function () {
    var dots = document.getElementsByTagName('span');
    for (var i = 0, len = dots.length; i < len; i++) {
      dots[i].className = '';
    }
    dots[this.index].className = 'on';
  };

  Marquee.prototype.changePhoto = function (offset) {
    var left = loopContainer.style.left,
      newleft = left ? parseInt(left) + offset : offset - 600;
    
    this.index = offset > 0 ? this.index - 1 : this.index + 1;
    if (this.index > 4) {
      this.index = 0;
    }
    if (this.index < 0) {
      this.index = 4;
    }
    // console.log(left);
    // console.log(newleft);
    // console.log('------');
    this.animate(newleft);
  };

  Marquee.prototype.gotoPhoto = function (count) {
    var newleft = count * -600;
    // console.log(newleft);
    this.index = count - 1;
    this.animate(newleft);
  }

  var maq = new Marquee();

  MPC.addEvent(prevBtn, 'click', function() {
    maq.changePhoto(600);
  });
  MPC.addEvent(nextBtn, 'click', function () {
    maq.changePhoto(-600);
  });
  MPC.addEvent(btns, 'click', function (event) {
    var count = parseInt(event.target.innerText);
    if (count < 6) {
      maq.gotoPhoto(count);
    }
  });
  startInterval();

  MPC.addEvent(wrap, 'mouseover', function () {
    stopFlag = 1;
    clearTimeout(maq.timer);
  });
  MPC.addEvent(wrap, 'mouseout', function () {
    stopFlag = 0;
    startInterval();
  });
  MPC.addEvent(document, 'visibilitychange', function () {  // 离开当前页面后动画停止
    if (document.hidden) {
      stopFlag = 1;
      clearTimeout(maq.timer);
    } else {
      stopFlag = 0;
      startInterval();
    }
  });
});