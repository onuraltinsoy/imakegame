$(document).ready(function(){
  var scene = $('#scene'),
      hero = $('#hero'),
      floor = $('.floor'),
      bg = $('#bg'),
      enemy = $('.enemy'),
      bonus = $('.bonus'),
      bullet = $('#bullet'),
      end = $('#end'),
      gamepad = $('#gamepad'),
      finish = $('#finish');

      $('body').append('<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css">');

  scene.width(scene.attr('width')).height(scene.attr('height'));

  gamepad.append(
      '<div class="btn-arrow up"><i class="fa fa-chevron-up" aria-hidden="true"></i></div>' +
      '<div class="btn-arrow down"><i class="fa fa-chevron-down" aria-hidden="true"></i></div>' +
      '<div class="btn-arrow right"><i class="fa fa-chevron-right" aria-hidden="true"></i></div>' +
      '<div class="btn-arrow left"><i class="fa fa-chevron-left" aria-hidden="true"></i></div>' +
      '<div class="btn-action jump"></div>' +
      '<div class="btn-action fire"></div>'
    );

  bg.css({
    'width': '300%',
    'height': '100%',
    'background': 'url(' + bg.attr('src') +  ') repeat-x',
    'backgroundSize': 'auto 100%'
  });

  bullet.hide();
  bullet.css({
    'width': bullet.attr('width'),
    'height': bullet.attr('height'),
    'background': 'url(' + bullet.attr('bg') +  ') repeat-x',
    'backgroundSize': 'auto 100%'
  });

  var sceneLimit = (scene.width() / 2) - 100;
  var hPosition = hero.attr('position').split(',');
  hero.width(hero.attr('width')).height(hero.attr('height'));
  hero.css({'top': parseInt(hPosition[0]), 'left': parseInt(hPosition[1])});

  var fPosition = finish.attr('position').split(',');
  finish.width(finish.attr('width')).height(finish.attr('height'));
  finish.css({'top': parseInt(fPosition[0]), 'left': parseInt(fPosition[1]), 'background': 'url(' + finish.attr('bg') + ') no-repeat', 'backgroundSize': 'auto 100%'});

  var fPosition;
  for(var i=0; i<floor.length; i++){
  fPosition = floor.eq(i).attr('position').split(',');  floor.eq(i).width(floor.eq(i).attr('width')).height(floor.eq(i).attr('height'));
  floor.eq(i).css({'top': parseInt(fPosition[0]), 'left': parseInt(fPosition[1]), 'background': 'url(' + floor.eq(i).attr('bg') + ') repeat-x', 'backgroundSize': 'auto 100%'});
  }

  var ePosition;
  var isEnemyCollision = [];
  var isEnemyKill = [];
  for(var i=0; i<enemy.length; i++){
  ePosition = enemy.eq(i).attr('position').split(',');  enemy.eq(i).width(enemy.eq(i).attr('width')).height(enemy.eq(i).attr('height'));
  enemy.eq(i).css({'top': parseInt(ePosition[0]), 'left': parseInt(ePosition[1]), 'background': 'url(' + enemy.eq(i).attr('bg') + ') repeat-x', 'backgroundSize': 'auto 100%'});

  isEnemyCollision[i] = false;
  isEnemyKill[i] = false;
  }

  var bPosition;
  for(var i=0; i<bonus.length; i++){
  bPosition = bonus.eq(i).attr('position').split(',');  bonus.eq(i).width(bonus.eq(i).attr('width')).height(bonus.eq(i).attr('height'));
  bonus.eq(i).css({'top': parseInt(bPosition[0]), 'left': parseInt(bPosition[1]), 'background': 'url(' + bonus.eq(i).attr('bg') + ') repeat-x', 'backgroundSize': 'auto 100%'});

  isEnemyCollision[i] = false;
  isEnemyKill[i] = false;
  }





  var isGravity = true;
  var jumpable = true;
  var movedRight = false;
  var movedLeft = false;
  var movedTop = false;
  var onFloor = false;
  var movedBottom = false;
  var isJump = false;
  var stopped = true;
  var eRotate = [];
  var eRoad = [];
  var isEnemyMortal = [];
  var heroSpeed = 7;
  var eSpeed = 3;
  var enemySpeed = [];
  var bgSpeed = 2;
  var fire = false;
  var bulletDirection = 'right';
  var bulletSpeed = 50;
  var automove = false;
  var life = 3;
  var gameOver = false;
  var score = 0;
  var shoot = true;
  var multiJump = false;

  if(hero.attr('life')){
    life = parseInt(hero.attr('life'));
  }

  $('#life span').text(life);
  $('#score span').text(score);

  if(scene.attr('automove') == 'true'){
    automove = true;
  }

  if(hero.attr('speed')){
    heroSpeed = parseInt(hero.attr('speed'));
  }

  if(hero.attr('multi-jump') == 'true'){
    multiJump = true;
  }else if(hero.attr('multi-jump') == 'false'){
    multiJump = false;
  }

  if(bullet.attr('speed')){
    bulletSpeed = parseInt(bullet.attr('speed'));
  }

  if(hero.attr('shoot') == 'false'){
    shoot = false;
  }



  if(bg.attr('speed')){
    bgSpeed = bg.attr('speed');
  }

  if(hero.attr('gravity') == 'false'){
    isGravity = false;
    jumpable = false;
  }


  var currentTop = hero.offset().top;
  var jumpLimit = currentTop - 130;


  for(var i=0; i<enemy.length; i++){
    eRotate[i] = 'left';

    eRoad[i] = enemy.eq(i).attr('road').split(',');
    isEnemyMortal[i] = enemy.eq(i).attr('mortal');

    if(enemy.eq(i).attr('speed')){
      enemySpeed[i] = enemy.eq(i).attr('speed');
    }else{
      enemySpeed[i] = eSpeed;
    }
  }

  var hx = parseInt(hPosition[1]);

  var app = {
    init: function(){
      app.gravity();
      if(jumpable == true){
        app.floorCollision();
      }else{
        onFloor = true;
      }
console.log(isJump);
      app.enemyRoad();
      app.enemyCollision();
      app.bonusCollision();
      app.firing();
      app.bulletCollision();
      app.sceneOut();
      app.finishCollision();
      if(movedRight == false && movedLeft == false && stopped == true){
 hero.css({'background': 'url(' + hero.attr('bg') + ')', 'backgroundSize': 'auto 100%'});
      }

      if(automove == false){
        if(movedRight == true && movedLeft == false){
          hero.css({'background': 'url(' + hero.attr('bg-move') + ')', 'backgroundSize': 'auto 100%', 'transform': 'rotateY(0deg)'});
          if(hx <= sceneLimit){
          hx += parseInt(heroSpeed);
          hero.css({'left': hx});
          }else{
            for(var i=0; i<floor.length; i++){
              floor.eq(i).css({'left': floor.eq(i).offset().left - scene.offset().left - heroSpeed});
            }

            for(var i=0; i<bonus.length; i++){
              bonus.eq(i).css({'left': bonus.eq(i).offset().left - scene.offset().left - heroSpeed});
            }

            finish.css({'left': finish.offset().left - scene.offset().left - heroSpeed});

            for(var i=0; i<enemy.length; i++){
              eRoad[i][0] -= 6;
              eRoad[i][1] -= 6;
              enemy.eq(i).css({'left': enemy.eq(i).offset().left - scene.offset().left - heroSpeed});
            }
            if(bg.offset().left + bg.width() > scene.offset().left + scene.width()){
            bg.css({'left': bg.offset().left - scene.offset().left - bgSpeed});
            }else{
              bg.css({'left': scene.offset().left - scene.width()});
              bg.css({'left': bg.offset().left - scene.offset().left - bgSpeed});
            }
          }
        }else if(movedLeft == true && movedRight == false){
          hero.css({'background': 'url(' + hero.attr('bg-move') + ')', 'backgroundSize': 'auto 100%', 'transform': 'rotateY(180deg)'});
          hx -= heroSpeed;
          hero.css({'left': hx});
        }
      }else{
        for(var i=0; i<floor.length; i++){
          floor.eq(i).css({'left': floor.eq(i).offset().left - scene.offset().left - heroSpeed});
        }

        for(var i=0; i<bonus.length; i++){
          bonus.eq(i).css({'left': bonus.eq(i).offset().left - scene.offset().left - heroSpeed});
        }

        for(var i=0; i<enemy.length; i++){
          eRoad[i][0] -= 6;
          eRoad[i][1] -= 6;
          enemy.eq(i).css({'left': enemy.eq(i).offset().left - scene.offset().left - heroSpeed});
        }
        if(bg.offset().left + bg.width() > scene.offset().left + scene.width()){
        bg.css({'left': bg.offset().left - scene.offset().left - bgSpeed});
        }else{
          bg.css({'left': scene.offset().left - scene.width()});
          bg.css({'left': bg.offset().left - scene.offset().left - bgSpeed});
        }
      }

      if(movedTop == true){
        hero.css({'top': hero.offset().top - scene.offset().top - heroSpeed});
      }

      if(movedBottom == true){
        hero.css({'top': hero.offset().top - scene.offset().top + heroSpeed});
      }

      for(var i=0; i<enemy.length; i++){
        if(eRotate[i] == 'left'){
          enemy.eq(i).css({'left': enemy.eq(i).offset().left - scene.offset().left - parseInt(enemySpeed[i]), 'transform': 'rotateY(0deg)'});
        }else if(eRotate[i] == 'right'){
          enemy.eq(i).css({'left': enemy.eq(i).offset().left - scene.offset().left + parseInt(enemySpeed[i]), 'transform': 'rotateY(180deg)'});
        }
      }

      if(hero.offset().top >= jumpLimit && isJump == true){
        isGravity = false;
        //hx += 3;
        hero.css({'top': hero.offset().top - 30, 'left': hx});
      }else{
        //isGravity = true;
        isJump = false;
      }

      if(gameOver == false){
        setTimeout(app.init, 30);
      }
    },
    gravity: function(){
      if(isGravity == true){
        hero.css({'top': hero.offset().top + 1});
      }else{
        return false;
      }
    },
    enemyRoad: function(){
      for(var i=0; i<enemy.length; i++){
        if(enemy.eq(i).offset().left - scene.offset().left <= eRoad[i][0]){
          eRotate[i] = 'right';
        }else if(enemy.eq(i).offset().left - scene.offset().left >= eRoad[i][1]){
          eRotate[i] = 'left';
        }
      }
    },
    floorCollision: function(){
      for(var i=0; i<floor.length; i++){
        if(hero.offset().left + hero.width() > floor.eq(i).offset().left && hero.offset().left < floor.eq(i).offset().left + floor.eq(i).width() && hero.offset().top + hero.height() >= floor.eq(i).offset().top - 1 && hero.offset().top < floor.eq(i).offset().top + 1 && isEnemyCollision.indexOf(true) ==  -1){
          isGravity = false;
          hero.css({'top': floor.eq(i).offset().top - scene.offset().top - hero.height()});
          onFloor = true;
          break;
        }else{
          isGravity = true;
          if(multiJump == false){
            onFloor = false;
          }else{
            onFloor = true;
          }
        }
      }
    },
    bonusCollision: function(){
      for(var i=0; i<bonus.length; i++){
        if(hero.offset().left + hero.width() > bonus.eq(i).offset().left && hero.offset().left < bonus.eq(i).offset().left + bonus.eq(i).width() && hero.offset().top + hero.height() >= bonus.eq(i).offset().top - 1 && hero.offset().top < bonus.eq(i).offset().top + 1){
          bonus.eq(i).hide();
          if($('audio#get-bonus')[0]){
            $('audio#get-bonus')[0].pause();
            $('audio#get-bonus')[0].currentTime = 0;
            $('audio#get-bonus')[0].play();
          }
          score += 10;
          $('#score span').text(score);
        }else{
        }
      }
    },
    finishCollision: function(){
        if(hero.offset().left + hero.width() > finish.offset().left){
          if($('audio#level')[0] && $('audio#level-clear')[0]){
            $('audio#level')[0].pause();
            $('audio#level')[0].currentTime = 0;
            $('audio#level-clear')[0].play();
          }
          stopped = true;
          movedLeft = false;
          movedRight = false;
          setTimeout(nextLevel, 3000);
        }
    },
    enemyCollision: function(){
      for(var i=0; i<enemy.length; i++){
        if(isEnemyMortal[i] && isEnemyMortal[i] == 'false'){
          if(hero.offset().left + hero.width() > enemy.eq(i).offset().left && hero.offset().left < enemy.eq(i).offset().left + enemy.eq(i).width() && hero.offset().top + hero.height() >= enemy.eq(i).offset().top - 1 && hero.offset().top < enemy.eq(i).offset().top + enemy.eq(i).height() && isEnemyKill[i] == false || isEnemyCollision[i] == true){
            hero.css({'transform': 'rotateX(180deg)'});
            isGravity = true;
            isEnemyCollision[i] = true;
            if($('audio#level')[0] && $('audio#hero-died')[0]){
              $('audio#level')[0].pause();
              $('audio#level')[0].currentTime = 0;
              $('audio#hero-died')[0].play();
            }
          }else{
            //isGravity = true;
            //isEnemyCollision = false;
          }
        }else{
          if(hero.offset().left + hero.width() > enemy.eq(i).offset().left && hero.offset().left < enemy.eq(i).offset().left + enemy.eq(i).width() && hero.offset().top + hero.height() >= enemy.eq(i).offset().top + 15 && hero.offset().top < enemy.eq(i).offset().top + enemy.eq(i).height() && isEnemyKill[i] == false || isEnemyCollision[i] == true){

              hero.css({'transform': 'rotateX(180deg)'});

              isGravity = true;
              isEnemyCollision[i] = true;
              if($('audio#level')[0] && $('audio#hero-died')[0]){
                $('audio#level')[0].pause();
                $('audio#level')[0].currentTime = 0;
                $('audio#hero-died')[0].play();
              }

          }else if(hero.offset().left + hero.width() > enemy.eq(i).offset().left && hero.offset().left < enemy.eq(i).offset().left + enemy.eq(i).width() && hero.offset().top + hero.height() <= enemy.eq(i).offset().top + 15 && hero.offset().top + hero.height() >= enemy.eq(i).offset().top && isEnemyKill[i] == false || isEnemyCollision[i] == true){
            //isGravity = true;
            //isEnemyCollision = false;
            isEnemyKill[i] = true;
            enemy.eq(i).css({'background': 'url(' + enemy.eq(i).attr('bg-kill') + ') no-repeat', 'backgroundSize': 'auto 100%'}).fadeOut(1000);
            //enemy.eq(i).hide();
            if($('audio#enemy-died')[0]){
              $('audio#enemy-died')[0].play();
            }
            isJump = true;
            currentTop = hero.offset().top;
            jumpLimit = currentTop - 130;
          }
        }
      }
    },
    bulletCollision: function(){
      if(bullet.length > 0){
        for(var i=0; i<enemy.length; i++){
          if(bullet.offset().left + bullet.width() > enemy.eq(i).offset().left && bullet.offset().left < enemy.eq(i).offset().left + enemy.eq(i).width() && bullet.offset().top + bullet.height() >= enemy.eq(i).offset().top - 1 && bullet.offset().top < enemy.eq(i).offset().top + enemy.eq(i).height() && isEnemyKill[i] == false){
            isEnemyKill[i] = true;
            enemy.eq(i).css({'background': 'url(' + enemy.eq(i).attr('bg-kill') + ') no-repeat', 'backgroundSize': 'auto 100%'}).fadeOut(1000);
            //enemy.eq(i).hide();
            if($('audio#enemy-died')[0]){
              $('audio#enemy-died')[0].play();
            }
            bullet.hide();
            fire = false;
          }else{
            //isGravity = true;
            //isEnemyCollision = false;
          }
        }
      }
    },
    firing: function(){
      if(fire == true){
          bullet.show();
          if(bulletDirection == 'right'){
            bullet.css({'left': bullet.offset().left - scene.offset().left + bulletSpeed});
          }else if(bulletDirection == 'left'){
            bullet.css({'left': bullet.offset().left - scene.offset().left - bulletSpeed});
          }else if(bulletDirection == 'top'){
            bullet.css({'top': bullet.offset().top - scene.offset().top - bulletSpeed});
          }else if(bulletDirection == 'bottom'){
            bullet.css({'top': bullet.offset().top - scene.offset().top + bulletSpeed});
          }

      }else{
        bullet.css({'top': (hero.offset().top - scene.offset().top + (hero.height() / 4)), 'left': hero.offset().left - scene.offset().left});
      }
    },
    sceneOut: function(){
      if(bullet.length > 0){
        if(bullet.offset().left < scene.offset().left || bullet.offset().left > scene.offset().left + scene.width() || bullet.offset().top < scene.offset().top || bullet.offset().top > scene.offset().top + scene.height()){
          fire = false;
          bullet.hide();
        }
      }

      if(hero.offset().left < scene.offset().left || hero.offset().left > scene.offset().left + scene.width() || hero.offset().top < scene.offset().top || hero.offset().top > scene.offset().top + scene.height()){
        life--;
        if(life <= 0){
          gameOver = true;
          end.show();
        }
        $('#life span').text(life);
        hero.css({'transform': 'rotateX(0deg)'});
        if($('audio#level')[0]){
          $('audio#level')[0].play();
        }

        for(var i=0; i<floor.length; i++){
        fPosition = floor.eq(i).attr('position').split(',');  floor.eq(i).width(floor.eq(i).attr('width')).height(floor.eq(i).attr('height'));
        floor.eq(i).css({'top': parseInt(fPosition[0]), 'left': parseInt(fPosition[1]), 'background': 'url(' + floor.eq(i).attr('bg') + ') repeat-x', 'backgroundSize': 'auto 100%'});
        }

        fPosition = finish.attr('position').split(',');
        finish.width(finish.attr('width')).height(finish.attr('height'));
        finish.css({'top': parseInt(fPosition[0]), 'left': parseInt(fPosition[1]), 'background': 'url(' + finish.attr('bg') + ') no-repeat', 'backgroundSize': 'auto 100%'});

        for(var i=0; i<enemy.length; i++){
          eRoad[i] = enemy.eq(i).attr('road').split(',');
          enemy.eq(i).show();
        ePosition = enemy.eq(i).attr('position').split(',');  enemy.eq(i).width(enemy.eq(i).attr('width')).height(enemy.eq(i).attr('height'));
        enemy.eq(i).css({'top': parseInt(ePosition[0]), 'left': parseInt(ePosition[1]), 'background': 'url(' + enemy.eq(i).attr('bg') + ') repeat-x', 'backgroundSize': 'auto 100%'});

        isEnemyCollision[i] = false;
        isEnemyKill[i] = false;
        }


        for(var i=0; i<bonus.length; i++){
          bonus.eq(i).show();
        bPosition = bonus.eq(i).attr('position').split(',');  bonus.eq(i).width(bonus.eq(i).attr('width')).height(bonus.eq(i).attr('height'));
        bonus.eq(i).css({'top': parseInt(bPosition[0]), 'left': parseInt(bPosition[1]), 'background': 'url(' + bonus.eq(i).attr('bg') + ') repeat-x', 'backgroundSize': 'auto 100%'});

        isEnemyCollision[i] = false;
        isEnemyKill[i] = false;
        }
        hero.css({'top': parseInt(hPosition[0]), 'left': parseInt(hPosition[1])});
        hx = parseInt(hPosition[1]);
      }
    }
  }

        $('#gamepad .right').bind('mousedown touchstart', function(){
          movedRight = true;
          movedLeft = false;
          stopped = false;
          if(fire == false){
            bulletDirection = 'right';
          }
        });

        $('#gamepad .right').bind('mouseup touchend', function(){
          movedRight = false;
          stopped = true;
        });

        $('#gamepad .left').bind('mousedown touchstart', function(){
          movedLeft = true;
          movedRight = false;
          stopped = false;
          if(fire == false){
            bulletDirection = 'left';
          }
        });

        $('#gamepad .left').bind('mouseup touchend', function(){
          movedLeft = false;
          stopped = true;
        });

        $('#gamepad .up, #gamepad .jump').bind('mousedown touchstart', function(){
          if(jumpable == true){

              isJump = true;

            currentTop = hero.offset().top;
            jumpLimit = currentTop - 130;
            if($('audio#jump')[0]){
              $('audio#jump')[0].play();
            }
          }else{
            movedTop = true;
            if(fire == false){
              //bulletDirection = 'top';
            }
          }
        });

        $('#gamepad .up, #gamepad .jump').bind('mouseup touchend', function(){
          movedTop = false;
          stopped = true;
        });

        $('#gamepad .down').bind('mousedown touchstart', function(){
          movedBottom = true;
          if(fire == false){
            //bulletDirection = 'bottom';
          }
        });

        $('#gamepad .down').bind('mouseup touchend', function(){
          movedBottom = false;
          stopped = true;
        });

        $('#gamepad .fire').click(function(){
          fire = true;
          if($('audio#shoot')[0]){
            $('audio#shoot')[0].play();
          }
        });

  $(document).keydown(function(e){
        console.log(e)
        if(e.which == 68){
          movedRight = true;
          movedLeft = false;
          stopped = false;
          if(fire == false){
            bulletDirection = 'right';
          }

        }else if(e.which == 65){
          movedLeft = true;
          movedRight = false;
          stopped = false;
          if(fire == false){
            bulletDirection = 'left';
          }

        } if(e.which == 87 && movedRight == true && onFloor == true){
          if(jumpable == true){

              isJump = true;

            currentTop = hero.offset().top;
            jumpLimit = currentTop - 130;
            if($('audio#jump')[0]){
              $('audio#jump')[0].play();
            }
          }else{
            movedTop = true;
            if(fire == false){
              //bulletDirection = 'top';
            }
          }

        }else if(e.which == 87 && movedLeft == true && onFloor == true){
          if(jumpable == true){

              isJump = true;

            currentTop = hero.offset().top;
            jumpLimit = currentTop - 130;
            if($('audio#jump')[0]){
              $('audio#jump')[0].play();
            }
          }else{
            movedTop = true;
            if(fire == false){
              //bulletDirection = 'top';
            }
          }

        }else if(e.which == 87 && movedRight == false && movedLeft == false && onFloor == true){
          console.log('burada');
          if(jumpable == true){
            console.log(onFloor);

              isJump = true;

            currentTop = hero.offset().top;
            jumpLimit = currentTop - 130;
            if($('audio#jump')[0]){
              $('audio#jump')[0].play();
            }
          }else{
            movedTop = true;
            if(fire == false){
              //bulletDirection = 'top';
            }
          }

        }else if(e.which == 83 && jumpable == false){
          movedBottom = true;
          if(fire == false){
            //bulletDirection = 'bottom';
          }

        }
        if(e.which == 13){
          if(shoot == true){
            fire = true;
            if($('audio#shoot')[0]){
              $('audio#shoot')[0].play();
            }
          }
        }
      });

  $(document).keyup(function(e){
    if(e.which == 68){
      movedRight = false;
      stopped = true;
    }
    else if(e.which == 65){
      movedLeft = false;
      stopped = true;
    }
    else if(e.which == 87){
      movedTop = false;
      stopped = true;
    }
    else if(e.which == 83){
      movedBottom = false;
      stopped = true;
    }
  });

  function nextLevel(){
    location.href=finish.attr('next-level')
  }

  app.init();
});
