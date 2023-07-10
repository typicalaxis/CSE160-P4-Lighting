function renderAnimal(){
    var body = new Cube();
    body.color = [0.0,1.0,0.0,1.0];
    body.matrix.translate(-.35,-.25,-.25);
    body.matrix.rotate(15,0,0,1);
    body.matrix.rotate(bodyAngle,0.5,0,0);
    body.matrix.scale(0.9,0.4,0.4);
    body.render();

    var lleg1 = new Cube();
    lleg1.color = [0.0,1.0,0.0,1.0];
    lleg1.matrix.translate(0.05,0.2,0.15);
    lleg1.matrix.rotate(g_lleg1Angle,0,0,1);

    var lleg1Coord = new Matrix4(lleg1.matrix);
    lleg1.matrix.scale(-0.3,-0.7,0.4);
    lleg1.render();

    var lleg2 = new Cube();
    lleg2.color = [0.0,1.0,0.0,1.0];
    lleg2.matrix = lleg1Coord;
    lleg2.matrix.translate(-0.75,-.55,0.05);
    lleg2.matrix.rotate(g_lleg2Angle,0,0,1);
    var lleg2Coord = new Matrix4(lleg2.matrix);
    lleg2.matrix.scale(-0.2,-0.6,0.3);
    lleg2.render();

    var lfoot = new Cube();
    lfoot.color = [0.0,1.0,0.0,1.0];
    lfoot.matrix = lleg2Coord;
    lfoot.matrix.translate(-0.10,.10,-0.05);
    lfoot.matrix.rotate(g_lfootAngle,0,0,1);
    lfoot.matrix.scale(0.5,0.1,0.4);
    lfoot.render();
    
    var rleg1 = new Cube();
    rleg1.color = [0.0,1.0,0.0,1.0];
    rleg1.matrix.translate(0.05,0.2,-0.65);
    rleg1.matrix.rotate(g_rleg1Angle,0,0,1);
    var rleg1Coord = new Matrix4(rleg1.matrix);
    rleg1.matrix.scale(-0.3,-0.7,0.4);
    rleg1.render();

    var rleg2 = new Cube();
    rleg2.color = [0.0,1.0,0.0,1.0];
    rleg2.matrix = rleg1Coord;
    rleg2.matrix.translate(-0.75,-.55,0.05);
    rleg2.matrix.rotate(g_rleg2Angle,0,0,1);
    var rleg2Coord = new Matrix4(rleg2.matrix);
    rleg2.matrix.scale(-0.2,-0.6,0.3);
    rleg2.render();

    var rfoot = new Cube();
    rfoot.color = [0.0,1.0,0.0,1.0];
    rfoot.matrix = rleg2Coord;
    rfoot.matrix.translate(-0.10,.10,-0.05);
    rfoot.matrix.rotate(g_lfootAngle,0,0,1);
    rfoot.matrix.scale(0.5,0.1,0.4);
    rfoot.render();

    var tail1 = new Cube();
    tail1.color = [0.0,1.0,0.0,1.0];
    tail1.matrix.translate(-.3,-.2,-.2);
    tail1.matrix.rotate(-tail1ZAngle,0,0.5,0);
    tail1.matrix.rotate(-g_tail1Angle,0,0,1);
    var tail1Coord = new Matrix4(tail1.matrix);
    tail1.matrix.scale(-0.6,0.3,0.3);
    tail1.render();

    var tail2 = new Cube();
    tail2.color = [0.0,1.0,0.0,1.0];
    tail2.matrix = tail1Coord;
    tail2.matrix.translate(-0.55,.05,0.05);
    tail2.matrix.rotate(-tail2ZAngle,0,0.5,0);
    tail2.matrix.rotate(-g_tail2Angle,0,0,1);
    tail2.matrix.scale(-0.4,0.2,0.2);
    tail2.render();

    var head1 = new Cube();
    head1.color = [0.0,1.0,0.0,1.0];
    head1.matrix.translate(.35,.25,-.35);
    head1.matrix.rotate(g_head1Angle,0,.5,0);
    head1.matrix.rotate(-g_head2YAngle,0,0,1);
    head1.matrix.scale(0.6,0.2,0.6);
    head1.render();

    var head2 = new Cube();
    head2.color = [0.0,1.0,0.0,1.0];
    head2.matrix.translate(0.35,.4,-.35);
    head2.matrix.rotate(g_head2Angle,0,0.5,0);
    head2.matrix.rotate(g_head2YAngle,0,0,1);
    var head2Coord = new Matrix4(head2.matrix);
    head2.matrix.scale(0.6,0.3,0.6);
    head2.render();

    
    var horn1 = new Cone();
    horn1.color = [.9,.9,.9];
    horn1.matrix = head2Coord;
    horn1.matrix.translate(0.15,.30,0.3);
    horn1.matrix.rotate(-90,1,0,0);
    horn1.matrix.scale(0.05,0.05,0.05);
    horn1.render();

    var horn2 = new Cone();
    horn2.color = [.9,.9,.9];
    horn2.matrix = head2Coord;
    horn2.matrix.translate(2.35,.0,0.0);
    horn2.render();

    var horn3 = new Cone();
    horn3.color = [.9,.9,.9];
    horn3.matrix = head2Coord;
    horn3.matrix.translate(2.35,.0,0.0);
    horn3.render();
}
function updateAnimationAngles(){
    if(pokeAnim){
        g_head1YAngle = (15*(Math.abs(Math.sin(g_secondsA))));
        g_head2YAngle = (25*(Math.abs(Math.sin(g_secondsA))));

        g_lleg1Angle = 25;
        g_rleg1Angle = 25;

        g_lleg2Angle = 90;
        g_rleg2Angle = 90;

        g_lfootAngle = 200;
        g_rfootAngle = 200;

        g_tail1Angle = (15*(Math.sin(g_secondsA)));
        g_tail2Angle = (15*(Math.sin(g_secondsA)));
    }
    else if(g_anim1){
        g_lleg1Angle = 25+(65*(-(Math.sin(g_secondsA))));
        g_rleg1Angle = 25+(65*(Math.sin(g_secondsA)));

        g_lleg2Angle = 90-(10*(Math.sin(g_secondsA)));
        g_rleg2Angle = 90-(10*(Math.sin(g_secondsA)));

        g_lfootAngle = 200-(10*(Math.sin(g_secondsA)));
        g_rfootAngle = 200-(10*(Math.sin(g_secondsA)));

        bodyAngle = (10*(Math.sin(g_secondsA)));
        if(!pokeAnim){
            g_head1Angle = (15*(Math.sin(g_secondsA)));
            g_head2Angle = (15*(Math.sin(g_secondsA)));
        }

        tail1ZAngle = (25*(Math.sin(g_secondsA)));
        tail2ZAngle = (25*(Math.sin(g_secondsA)));
    }
}