/* ===========================================================
 * jquery-let_it_snow.js v1
 * ===========================================================
 * NOTE: This plugin is based on the work by Jason Brown (Loktar00)
 * https://github.com/loktar00/JQuery-Snowfall
 * http://www.thepetedesign.com
 *
 * As the end of the year approaches, let's add 
 * some festive to your website!
 *
 * https://github.com/peachananr/let_it_snow
 *
 * ========================================================== */

!function($){
  
    
  var defaults = {
    speed: 0,
    interaction: true,
    size: 2,
    count: 200,
    opacity: 0,
    color: "#ffffff",
    windPower: 0,
    image: false
    };

    (function() {
        var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame ||
            function(callback) {
            return window.setTimeout(callback, 17 /*~ 1000/60*/);
        };
        var cancelAnimationFrame = window.cancelAnimationFrame || window.mozCancelAnimationFrame || window.webkitCancelAnimationFrame || window.msCancelAnimationFrame || window.clearTimeout;
        window.requestAnimationFrame = requestAnimationFrame;
        window.cancelAnimationFrame = cancelAnimationFrame;
    })();

  $.fn.let_it_snow = function(options){
    var settings = $.extend({}, defaults, options),
        el = $(this),
        flakes = [],
        canvas = el.get(0),
        ctx = canvas.getContext("2d"),
        flakeCount = settings.count,
        animationHandler = 0,
        resizeTimeHandler = 0,
        isDestroy = false,
        mX = -100,
        mY = -100;
    
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        el.on("letItSnow.set", function (event, prop, value) {
            settings[prop] = value;
        });

        el.on("letItSnow.stop", function (event) {
            stopSnow();
        });

        el.on("letItSnow.start", function (event) {
            snow();
        });

        el.on("letItSnow.hide", function (event) {
            hideSnow();
        });
        
        el.on("letItSnow.show", function (event) {
            snow();
        });

        el.on("letItSnow.destroy", function (event) {
            destroySnow();
        });
    
    function stopSnow() {
        if (animationHandler !== 0) {
            cancelAnimationFrame(animationHandler);
            animationHandler = 0;
        }
    }

    function hideSnow() {
        stopSnow();
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    function destroySnow(){
        hideSnow();
        flakes = [];
        isDestroy = true;

        if (settings.interaction == true) {
            canvas.removeEventListener("mousemove", updateMouseMove);
        }

        $('#lis_flake').remove();
    }

    function snow() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (var i = 0; i < flakeCount; i++) {
            var flake = flakes[i],
                x = mX,
                y = mY,
                minDist = 100,
                x2 = flake.x,
                y2 = flake.y;

            var dist = Math.sqrt((x2 - x) * (x2 - x) + (y2 - y) * (y2 - y)),
                dx = x2 - x,
                dy = y2 - y;

            if (dist < minDist) {
                var force = minDist / (dist * dist),
                    xcomp = (x - x2) / dist,
                    ycomp = (y - y2) / dist,
                    deltaV = force / 2;

                flake.velX -= deltaV * xcomp;
                flake.velY -= deltaV * ycomp;

            } else {
                flake.velX *= .98;
                if (flake.velY <= flake.speed) {
                    flake.velY = flake.speed
                }
                
                switch (settings.windPower) { 
                  case false:
                    flake.velX += Math.cos(flake.step += .05) * flake.stepSize;
                  break;
                  
                  case 0:
                    flake.velX += Math.cos(flake.step += .05) * flake.stepSize;
                  break;
                  
                  default: 
                    flake.velX += 0.01 + (settings.windPower/100);
                }
            }

            var s = settings.color;
            var patt = /^#([\da-fA-F]{2})([\da-fA-F]{2})([\da-fA-F]{2})$/;
            var matches = patt.exec(s);
            var rgb = parseInt(matches[1], 16)+","+parseInt(matches[2], 16)+","+parseInt(matches[3], 16);

            
            flake.y += flake.velY;
            flake.x += flake.velX;

            if (flake.y >= canvas.height || flake.y <= 0) {
                reset(flake);
            }


            if (flake.x >= canvas.width || flake.x <= 0) {
                reset(flake);
            }
            if (settings.image == false) {
              ctx.fillStyle = "rgba(" + rgb + "," + flake.opacity + ")"
              ctx.beginPath();
              ctx.arc(flake.x, flake.y, flake.size, 0, Math.PI * 2);
              ctx.fill();
            } else {
              
              ctx.drawImage($("img#lis_flake").get(0), flake.x, flake.y, flake.size * 2, flake.size * 2);
            }
            
        }
        animationHandler = requestAnimationFrame(snow);
    };
    
    
    function reset(flake) {
        
        if (settings.windPower == false || settings.windPower == 0) {
          flake.x = Math.floor(Math.random() * canvas.width);
          flake.y = 0;
        } else {
          if (settings.windPower > 0) {
            var xarray = Array(Math.floor(Math.random() * canvas.width), 0);
            var yarray = Array(0, Math.floor(Math.random() * canvas.height))
            var allarray = Array(xarray, yarray)
            
            var selected_array = allarray[Math.floor(Math.random()*allarray.length)];
            
             flake.x = selected_array[0];
             flake.y = selected_array[1];
          } else {
            var xarray = Array(Math.floor(Math.random() * canvas.width),0);
            var yarray = Array(canvas.width, Math.floor(Math.random() * canvas.height))
            var allarray = Array(xarray, yarray)
            
            var selected_array = allarray[Math.floor(Math.random()*allarray.length)];
            
             flake.x = selected_array[0];
             flake.y = selected_array[1];
          }
        }
        
        flake.size = (Math.random() * 3) + settings.size;
        flake.speed = (Math.random() * 1) + settings.speed;
        flake.velY = flake.speed;
        flake.velX = 0;
        flake.opacity = (Math.random() * 0.5) + settings.opacity;
    }
     function init() {
      for (var i = 0; i < flakeCount; i++) {
          var x = Math.floor(Math.random() * canvas.width),
              y = Math.floor(Math.random() * canvas.height),
              size = (Math.random() * 3)  + settings.size,
              speed = (Math.random() * 1) + settings.speed,
              opacity = (Math.random() * 0.5) + settings.opacity;
      
          flakes.push({
              speed: speed,
              velY: speed,
              velX: 0,
              x: x,
              y: y,
              size: size,
              stepSize: (Math.random()) / 30,
              step: 0,
              angle: 180,
              opacity: opacity
          });
      }
      
      if (settings.interaction == true) {
          canvas.addEventListener("mousemove", updateMouseMove);
      }

      isDestroy = false;

      if (settings.image != false) {
          $("<img src='"+settings.image+"' style='display: none' id='lis_flake'>").prependTo("body")
      }

      snow();
    }
    
    
    init();

    $(window).resize(function() {

      if (isDestroy) {
          return;
      }

      if(resizeTimeHandler) {
          clearTimeout(resizeTimeHandler);
          resizeTimeHandler = 0;
      }

      resizeTimeHandler = setTimeout(function() {
        el2 = el.clone();
        el2.insertAfter(el);
        el.remove();
        
        el2.let_it_snow(settings);
      }, 200);
    });

    function updateMouseMove(e){
        mX = e.clientX,
        mY = e.clientY;
    }
    
  }
}(window.jQuery);
