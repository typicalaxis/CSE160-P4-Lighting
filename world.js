// Blocky Animals.js Benjamin Grinnell
// Vertex shader program
var VSHADER_SOURCE =
  `attribute vec4 a_Position;
   attribute vec2 a_UV;
   varying vec2 v_UV;
   uniform mat4 u_ModelMatrix;
   uniform mat4 u_GlobalRotateMatrix;
   uniform mat4 u_ViewMatrix;
   uniform mat4 u_ProjectionMatrix;
   void main() {
    gl_Position = u_ProjectionMatrix * u_ViewMatrix * u_GlobalRotateMatrix * u_ModelMatrix * a_Position;
    v_UV = a_UV;
   }`

// Fragment shader program
var FSHADER_SOURCE =
 `precision mediump float;
  uniform vec4 u_FragColor;
  varying vec2 v_UV;
  uniform sampler2D u_Sampler0;
  uniform sampler2D u_Sampler1;  
  uniform sampler2D u_Sampler2; 
  uniform int u_whichTexture;
  void main() {
    if(u_whichTexture == -1){
        gl_FragColor = u_FragColor;
    }
    else if (u_whichTexture == 0){
        gl_FragColor = texture2D(u_Sampler0,v_UV);
    }
    else if (u_whichTexture == 1){
        gl_FragColor = texture2D(u_Sampler1,v_UV);
    }
    else if (u_whichTexture == 2){
        gl_FragColor = texture2D(u_Sampler2,v_UV);
    }
    else{
        gl_FragColor = vec4(0.75,0,1,1);
    }
  }`

let canvas;
let gl;
let a_Position;
let a_UV;
let u_FragColor;

let u_ModelMatrix;
let u_GlobalRotateMatrix;
let u_ProjectionMatrix;
let u_ViewMatrix;

let u_Sampler0;
let u_Sampler1;
let u_Sampler2;
let u_whichTexture;


let g_globalXAngle = 0;
let g_globalYAngle = 0;
let g_camera;
let oldX;
let oldY;
let newX;
let newY;

let g_tail1Angle = 0;
let g_tail2Angle = 0;
let g_anim1 = true;
let pokeAnim = false;

let g_lleg1Angle = 35;
let g_rleg1Angle = 35;
let g_lleg2Angle = 90;
let g_rleg2Angle = 90;

let g_lfootAngle = 200;
let g_rfootAngle = 200;

let bodyAngle = 0;
let tail1ZAngle = 0;
let tail2ZAngle = 0;

let g_head1Angle = 0;
let g_head2Angle = 0;

let g_head1YAngle = -5;
let g_head2YAngle = 5;




function setupWebGL(){
    // Retrieve <canvas> element
    canvas = document.getElementById('webgl');

    // Get the rendering context for WebGL
    gl = canvas.getContext("webgl", { preserveDrawingBuffer: true})
    if (!gl) {
        console.log('Failed to get the rendering context for WebGL');
        return;
    }

    gl.enable(gl.DEPTH_TEST);
}
function setUpHtmlUI(){
    

    document.getElementById("tail1Slide").addEventListener("mousemove",function(){if(!g_anim1){g_tail1Angle = this.value;}});
    document.getElementById("tail2Slide").addEventListener("mousemove",function(){if(!g_anim1){g_tail2Angle = this.value;}});

    document.getElementById("angleSlide").addEventListener("mousemove",function(){g_globalYAngle = this.value; renderScene();});

    document.getElementById("onButton").onclick = function(){g_anim1 = true;g_AstartTime = performance.now()/1000.0; renderScene();};
    document.getElementById("offButton").onclick = function(){g_anim1 = false};

    
    
}
var g_startTime = performance.now()/1000.0;
var g_AstartTime = 0;
var g_seconds = performance.now()/1000.0 - g_startTime;
var g_secondsA = performance.now()/1000.0 - g_AstartTime;

function tick(){
    g_seconds = performance.now()/1000.0 - g_startTime;
    g_secondsA = performance.now()/1000.0 - g_AstartTime;
    if(pokeAnim && g_secondsA > 3){
        pokeAnim =false;
    }
    updateAnimationAngles();
    renderScene();
    requestAnimationFrame(tick);
}
function initTextures(imgid) {
    if(imgid === 1){
        var image = new Image();  // Create the image object
        if (!image) {
        console.log('Failed to create the image object');
        return false;
        }
        // Register the event handler to be called on loading an image
        image.onload = function(){ sendTextureToGl(image,1); };
        // Tell the browser to load an image
        image.src = 'concrete.jpg';
    }
    else if(imgid ===2){
        var image = new Image();  // Create the image object
        if (!image) {
        console.log('Failed to create the image object');
        return false;
        }
        // Register the event handler to be called on loading an image
        image.onload = function(){ sendTextureToGl(image,2); };
        // Tell the browser to load an image
        image.src = 'road2.jpg';
        
    }
    else if(imgid ===3){
        var image = new Image();  // Create the image object
        if (!image) {
        console.log('Failed to create the image object');
        return false;
        }
        // Register the event handler to be called on loading an image
        image.onload = function(){ sendTextureToGl(image,3); };
        // Tell the browser to load an image
        image.src = 'scale.jpg';
        
    }
  
    return true;
  }
  
  function sendTextureToGl(image,index) {
    if(index === 1){
        var texture = gl.createTexture();   // Create a texture object
        if (!texture) {
        console.log('Failed to create the texture object');
        return false;
        }
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); // Flip the image's y axis
        // Enable texture unit0
        gl.activeTexture(gl.TEXTURE0);
        // Bind the texture object to the target
        gl.bindTexture(gl.TEXTURE_2D, texture);
    
        // Set the texture parameters
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        // Set the texture image
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
        
        // Set the texture unit 0 to the sampler
        gl.uniform1i(u_Sampler0, 0);
    }
    else if(index === 2){
        var texture = gl.createTexture();   // Create a texture object
        if (!texture) {
        console.log('Failed to create the texture object');
        return false;
        }
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); // Flip the image's y axis
        // Enable texture unit0
        gl.activeTexture(gl.TEXTURE1);
        // Bind the texture object to the target
        gl.bindTexture(gl.TEXTURE_2D, texture);
    
        // Set the texture parameters
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        // Set the texture image
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
        
        // Set the texture unit 0 to the sampler
        gl.uniform1i(u_Sampler1, 1);
    }
    else if(index === 3){
        var texture = gl.createTexture();   // Create a texture object
        if (!texture) {
        console.log('Failed to create the texture object');
        return false;
        }
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); // Flip the image's y axis
        // Enable texture unit0
        gl.activeTexture(gl.TEXTURE2);
        // Bind the texture object to the target
        gl.bindTexture(gl.TEXTURE_2D, texture);
    
        // Set the texture parameters
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        // Set the texture image
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
        
        // Set the texture unit 0 to the sampler
        gl.uniform1i(u_Sampler2, 2);
    }
  }


function main() {
    setupWebGL();
    connectVariablesToGLSL();
    setUpHtmlUI();

    initTextures(1);
    initTextures(2);
    initTextures(3);
    // Register function (event handler) to be called on a mouse press
    canvas.onmousedown = click;
    canvas.onmousemove = function(ev){mMove(ev)};
    document.onkeydown = keydown;
    
    g_camera = new Camera();

    // Specify the color for clearing <canvas>
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    

    requestAnimationFrame(tick);
}
function keydown(ev){
    if(ev.keyCode == 87){
        g_camera.moveForwards();
    } else if(ev.keyCode == 83){
        g_camera.moveBackwards();
    } else if(ev.keyCode == 65){
        g_camera.moveLeft();
    } else if(ev.keyCode == 68){
        g_camera.moveRight();
    }
    else if(ev.keyCode == 81){
        g_camera.rotateLeft();
    }
    else if(ev.keyCode == 69){
        g_camera.rotateRight();
    }
}


var g_shapesList = [];

//var g_points = [];  // The array for the position of a mouse press
//var g_colors = [];  // The array to store the color of a point
//var g_sizes = [];
function click(ev) {
    if(ev.buttons == 1){
        addDel(1);
    }
    else if(ev.buttons == 2){
        addDel(2);
    }
}
function mMove(ev){
    newX = ev.clientX; // x coordinate of a mouse pointer
    newY = ev.clientY; // y coordinate of a mouse pointer
    var xDelta = newX - oldX;
    g_globalXAngle = newY - oldY;
    if(xDelta > 0){
        g_camera.mouseRotate(-1);
    }
    else if (xDelta < 0){
        g_camera.mouseRotate(1);
    }
    
    oldX = newX;
    oldY = newY;

}
function addDel(button){
    var x = Math.round(g_camera.eye.elements[0])+4;
    var z = Math.round(g_camera.eye.elements[2])+4;
    var lookx = Math.round(g_camera.at.elements[0])+4;
    var lookz = Math.round(g_camera.at.elements[2])+4;
    if(lookx > x){
        x = x+1;
    }else if(lookx < x){
        x = x-1;
    }
    
    if(lookz > z){
        z = z+1;
    }else if(lookz < z){
        z = z-1;
    }
    if(x > 32 || x < 0 || z > 32 || z < 0){
        console.log("Off Map");
        return;
    }
    if(button === 1){
        g_map[x][z] = g_map[x][z] +1;

    } else if(button === 2 && g_map[x][z] >0){
        g_map[x][z] = g_map[x][z] -1;
    }

}
var animTimer = 0;

var g_map = [
    [3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3],
    [3,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,3],
    [3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3],
    [3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3],
    [3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3],
    [3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3],
    [3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3],
    [3,0,0,0,0,0,0,0,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,0,0,0,0,0,0,0,3],
    [3,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,3],
    [3,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,3],
    [3,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,3],
    [3,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,3],
    [3,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,3],
    [3,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,3],
    [3,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,3],
    [3,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,3],
    [3,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,3],
    [3,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,3],
    [3,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,3],
    [3,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,3],
    [3,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,3],
    [3,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,3],
    [3,4,4,4,4,4,4,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,3],
    [3,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,3],
    [3,0,0,0,0,0,0,0,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,0,0,0,0,0,0,0,3],
    [3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3],
    [3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3],
    [3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3],
    [3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3],
    [3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3],
    [3,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,3],
    [3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3]
];
function drawMap(){
    for(x=0;x<32;x++){
        for(y=0;y<32;y++){
            for(h = 0;h < g_map[x][y];h++){
                if(g_map[x][y] === 4 && x === 22 && h < 3){

                }
                else{
                    var cube = new Cube();
                    cube.color = [1.0,0.0,0.0,1.0];
                    
                    if(x === 22 && y < 8){
                        cube.textureNum = -1;
                    }
                    else{
                        cube.textureNum = 0;
                    }
                    
                    
                    cube.matrix.translate(x-4,h-.75,y-4);
                    cube.renderFast();
                }

            }
        
        }
    }
}


function renderScene(){
    var startTime = performance.now();

    var ProjMatrix = new Matrix4();
    ProjMatrix.setPerspective(90, canvas.width/canvas.height, 0.1, 1000 );
    gl.uniformMatrix4fv(u_ProjectionMatrix, false, ProjMatrix.elements);

    var viewMatrix = new Matrix4();
    viewMatrix.setLookAt(g_camera.eye.elements[0],g_camera.eye.elements[1],g_camera.eye.elements[2],  g_camera.at.elements[0],g_camera.at.elements[1],g_camera.at.elements[2],   g_camera.up.elements[0],g_camera.up.elements[1],g_camera.up.elements[2]); //(eye, look at, up)
    gl.uniformMatrix4fv(u_ViewMatrix, false, viewMatrix.elements);

    var globalRotMat = new Matrix4().rotate(0,1,0,0);
    globalRotMat.rotate(g_globalYAngle,0,1,0);
    gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat.elements);

    // Clear <canvas>
    gl.clear(gl.COLOR_BUFFER_BIT  | gl.DEPTH_BUFFER_BIT);


    var floor = new Cube();
    floor.textureNum = 1;
    floor.color = [1.0,1.0,1.0,1.0];
    floor.matrix.translate(0,-0.75,0);
    floor.matrix.scale(75,0,75);
    floor.matrix.translate(-.5,0,-.5);
    floor.renderFast();

    var sky = new Cube();
    sky.textureNum = -1;
    sky.color = [0.0,0.0,1.0,1.0];
    sky.matrix.scale(500,500,500);
    sky.matrix.translate(-.5,-.5,-.5);
    sky.renderFast();
   

    drawMap();
    var xDis = 5;
    var yDis = 0;
    var zDis = 1;
    
    var body = new Cube();
    body.textureNum = 2;
    body.color = [0.0,1.0,0.0,1.0];
    body.matrix.translate(xDis+(-.35),yDis+(-.05),zDis+(-.25));
    body.matrix.rotate(15,0,0,1);
    body.matrix.rotate(bodyAngle,0.5,0,0);
    body.matrix.scale(0.9,0.4,0.4);
    body.renderFast();

    var lleg1 = new Cube();
    lleg1.textureNum = 2;
    lleg1.color = [0.0,1.0,0.0,1.0];
    lleg1.matrix.translate(xDis+0.05,yDis+0.4,zDis+0.15);
    lleg1.matrix.rotate(g_lleg1Angle,0,0,1);
    var lleg1Coord = new Matrix4(lleg1.matrix);
    lleg1.matrix.scale(-0.3,-0.7,0.4);
    lleg1.renderFast();

    var lleg2 = new Cube();
    lleg2.textureNum = 2;
    lleg2.color = [0.0,1.0,0.0,1.0];
    lleg2.matrix = lleg1Coord;
    lleg2.matrix.translate(-0.75,-.55,0.05);
    lleg2.matrix.rotate(g_lleg2Angle,0,0,1);
    var lleg2Coord = new Matrix4(lleg2.matrix);
    lleg2.matrix.scale(-0.2,-0.6,0.3);
    lleg2.renderFast();

    var lfoot = new Cube();
    lfoot.textureNum = 2;
    lfoot.color = [0.0,1.0,0.0,1.0];
    lfoot.matrix = lleg2Coord;
    lfoot.matrix.translate(-0.10,.10,-0.05);
    lfoot.matrix.rotate(g_lfootAngle,0,0,1);
    lfoot.matrix.scale(0.5,0.1,0.4);
    lfoot.renderFast();
    
    var rleg1 = new Cube();
    rleg1.textureNum = 2;
    rleg1.color = [0.0,1.0,0.0,1.0];
    rleg1.matrix.translate(xDis+0.05,yDis+0.4,zDis+-0.65);
    rleg1.matrix.rotate(g_rleg1Angle,0,0,1);
    var rleg1Coord = new Matrix4(rleg1.matrix);
    rleg1.matrix.scale(-0.3,-0.7,0.4);
    rleg1.renderFast();

    var rleg2 = new Cube();
    rleg2.textureNum = 2;
    rleg2.color = [0.0,1.0,0.0,1.0];
    rleg2.matrix = rleg1Coord;
    rleg2.matrix.translate(-0.75,-.55,0.05);
    rleg2.matrix.rotate(g_rleg2Angle,0,0,1);
    var rleg2Coord = new Matrix4(rleg2.matrix);
    rleg2.matrix.scale(-0.2,-0.6,0.3);
    rleg2.renderFast();

    var rfoot = new Cube();
    rfoot.textureNum = 2;
    rfoot.color = [0.0,1.0,0.0,1.0];
    rfoot.matrix = rleg2Coord;
    rfoot.matrix.translate(-0.10,.10,-0.05);
    rfoot.matrix.rotate(g_lfootAngle,0,0,1);
    rfoot.matrix.scale(0.5,0.1,0.4);
    rfoot.renderFast();

    var tail1 = new Cube();
    tail1.textureNum = 2;
    tail1.color = [0.0,1.0,0.0,1.0];
    tail1.matrix.translate(xDis+-.3,yDis+0,zDis+-.2);
    tail1.matrix.rotate(-tail1ZAngle,0,0.5,0);
    tail1.matrix.rotate(-g_tail1Angle,0,0,1);
    var tail1Coord = new Matrix4(tail1.matrix);
    tail1.matrix.scale(-0.6,0.3,0.3);
    tail1.renderFast();

    var tail2 = new Cube();
    tail2.textureNum = 2;
    tail2.color = [0.0,1.0,0.0,1.0];
    tail2.matrix = tail1Coord;
    tail2.matrix.translate(-0.55,.05,0.05);
    tail2.matrix.rotate(-tail2ZAngle,0,0.5,0);
    tail2.matrix.rotate(-g_tail2Angle,0,0,1);
    tail2.matrix.scale(-0.4,0.2,0.2);
    tail2.renderFast();

    var head1 = new Cube();
    head1.textureNum = 2;
    head1.color = [0.0,1.0,0.0,1.0];
    head1.matrix.translate(xDis+.35,yDis+.45,zDis+-.35);
    head1.matrix.rotate(g_head1Angle,0,.5,0);
    head1.matrix.rotate(-g_head2YAngle,0,0,1);
    head1.matrix.scale(0.6,0.2,0.6);
    head1.renderFast();

    var head2 = new Cube();
    head2.textureNum = 2;
    head2.color = [0.0,1.0,0.0,1.0];
    head2.matrix.translate(xDis+0.35,yDis+.6,zDis+-.35);
    head2.matrix.rotate(g_head2Angle,0,0.5,0);
    head2.matrix.rotate(g_head2YAngle,0,0,1);
    var head2Coord = new Matrix4(head2.matrix);
    head2.matrix.scale(0.6,0.3,0.6);
    head2.renderFast();

    
    var horn1 = new Cone();
    horn1.textureNum = 2;
    horn1.color = [.9,.9,.9];
    horn1.matrix = head2Coord;
    horn1.matrix.translate(0.15,.30,0.3);
    horn1.matrix.rotate(-90,1,0,0);
    horn1.matrix.scale(0.05,0.05,0.05);
    horn1.render();

    var horn2 = new Cone();
    horn2.textureNum = 2;
    horn2.color = [.9,.9,.9];
    horn2.matrix = head2Coord;
    horn2.matrix.translate(2.35,.0,0.0);
    horn2.render();

    var horn3 = new Cone();
    horn3.textureNum = 2;
    horn3.color = [.9,.9,.9];
    horn3.matrix = head2Coord;
    horn3.matrix.translate(2.35,.0,0.0);
    horn3.render();


///////////////////////////////////////////////////////////////////////////////////////////////////////////////
    zDis = zDis -2;
    xDis = xDis +4;

    var body = new Cube();
    body.textureNum = 2;
    body.color = [0.0,1.0,0.0,1.0];
    body.matrix.translate(xDis+-.35,yDis+-.05,zDis+-.25);
    body.matrix.rotate(15,0,0,1);
    body.matrix.rotate(bodyAngle,0.5,0,0);
    body.matrix.scale(0.9,0.4,0.4);
    body.renderFast();

    var lleg1 = new Cube();
    lleg1.textureNum = 2;
    lleg1.color = [0.0,1.0,0.0,1.0];
    lleg1.matrix.translate(xDis+0.05,yDis+0.4,zDis+0.15);
    lleg1.matrix.rotate(g_lleg1Angle,0,0,1);
    var lleg1Coord = new Matrix4(lleg1.matrix);
    lleg1.matrix.scale(-0.3,-0.7,0.4);
    lleg1.renderFast();

    var lleg2 = new Cube();
    lleg2.textureNum = 2;
    lleg2.color = [0.0,1.0,0.0,1.0];
    lleg2.matrix = lleg1Coord;
    lleg2.matrix.translate(-0.75,-.55,0.05);
    lleg2.matrix.rotate(g_lleg2Angle,0,0,1);
    var lleg2Coord = new Matrix4(lleg2.matrix);
    lleg2.matrix.scale(-0.2,-0.6,0.3);
    lleg2.renderFast();

    var lfoot = new Cube();
    lfoot.textureNum = 2;
    lfoot.color = [0.0,1.0,0.0,1.0];
    lfoot.matrix = lleg2Coord;
    lfoot.matrix.translate(-0.10,.10,-0.05);
    lfoot.matrix.rotate(g_lfootAngle,0,0,1);
    lfoot.matrix.scale(0.5,0.1,0.4);
    lfoot.renderFast();
    
    var rleg1 = new Cube();
    rleg1.textureNum = 2;
    rleg1.color = [0.0,1.0,0.0,1.0];
    rleg1.matrix.translate(xDis+0.05,yDis+0.4,zDis+-0.65);
    rleg1.matrix.rotate(g_rleg1Angle,0,0,1);
    var rleg1Coord = new Matrix4(rleg1.matrix);
    rleg1.matrix.scale(-0.3,-0.7,0.4);
    rleg1.renderFast();

    var rleg2 = new Cube();
    rleg2.textureNum = 2;
    rleg2.color = [0.0,1.0,0.0,1.0];
    rleg2.matrix = rleg1Coord;
    rleg2.matrix.translate(-0.75,-.55,0.05);
    rleg2.matrix.rotate(g_rleg2Angle,0,0,1);
    var rleg2Coord = new Matrix4(rleg2.matrix);
    rleg2.matrix.scale(-0.2,-0.6,0.3);
    rleg2.renderFast();

    var rfoot = new Cube();
    rfoot.textureNum = 2;
    rfoot.color = [0.0,1.0,0.0,1.0];
    rfoot.matrix = rleg2Coord;
    rfoot.matrix.translate(-0.10,.10,-0.05);
    rfoot.matrix.rotate(g_lfootAngle,0,0,1);
    rfoot.matrix.scale(0.5,0.1,0.4);
    rfoot.renderFast();

    var tail1 = new Cube();
    tail1.textureNum = 2;
    tail1.color = [0.0,1.0,0.0,1.0];
    tail1.matrix.translate(xDis+-.3,yDis+0,zDis+-.2);
    tail1.matrix.rotate(-tail1ZAngle,0,0.5,0);
    tail1.matrix.rotate(-g_tail1Angle,0,0,1);
    var tail1Coord = new Matrix4(tail1.matrix);
    tail1.matrix.scale(-0.6,0.3,0.3);
    tail1.renderFast();

    var tail2 = new Cube();
    tail2.textureNum = 2;
    tail2.color = [0.0,1.0,0.0,1.0];
    tail2.matrix = tail1Coord;
    tail2.matrix.translate(-0.55,.05,0.05);
    tail2.matrix.rotate(-tail2ZAngle,0,0.5,0);
    tail2.matrix.rotate(-g_tail2Angle,0,0,1);
    tail2.matrix.scale(-0.4,0.2,0.2);
    tail2.renderFast();

    var head1 = new Cube();
    head1.textureNum = 2;
    head1.color = [0.0,1.0,0.0,1.0];
    head1.matrix.translate(xDis+.35,yDis+.45,zDis+-.35);
    head1.matrix.rotate(g_head1Angle,0,.5,0);
    head1.matrix.rotate(-g_head2YAngle,0,0,1);
    head1.matrix.scale(0.6,0.2,0.6);
    head1.renderFast();

    var head2 = new Cube();
    head2.textureNum = 2;
    head2.color = [0.0,1.0,0.0,1.0];
    head2.matrix.translate(xDis+0.35,yDis+.6,zDis+-.35);
    head2.matrix.rotate(g_head2Angle,0,0.5,0);
    head2.matrix.rotate(g_head2YAngle,0,0,1);
    var head2Coord = new Matrix4(head2.matrix);
    head2.matrix.scale(0.6,0.3,0.6);
    head2.renderFast();

    
    var horn1 = new Cone();
    horn1.textureNum = 2;
    horn1.color = [.9,.9,.9];
    horn1.matrix = head2Coord;
    horn1.matrix.translate(0.15,.30,0.3);
    horn1.matrix.rotate(-90,1,0,0);
    horn1.matrix.scale(0.05,0.05,0.05);
    horn1.render();

    var horn2 = new Cone();
    horn2.textureNum = 2;
    horn2.color = [.9,.9,.9];
    horn2.matrix = head2Coord;
    horn2.matrix.translate(2.35,.0,0.0);
    horn2.render();

    var horn3 = new Cone();
    horn3.textureNum = 2;
    horn3.color = [.9,.9,.9];
    horn3.matrix = head2Coord;
    horn3.matrix.translate(2.35,.0,0.0);
    horn3.render();

    /*
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
    zDis = zDis +3;
    xDis = xDis +8;

    var body = new Cube();
    body.textureNum = -1;
    body.color = [0.0,1.0,0.0,1.0];
    body.matrix.translate(xDis+-.35,yDis+-.05,zDis+-.25);
    body.matrix.rotate(15,0,0,1);
    body.matrix.rotate(bodyAngle,0.5,0,0);
    body.matrix.scale(0.9,0.4,0.4);
    body.renderFast();

    var lleg1 = new Cube();
    lleg1.textureNum = -1;
    lleg1.color = [0.0,1.0,0.0,1.0];
    lleg1.matrix.translate(xDis+0.05,yDis+0.4,zDis+0.15);
    lleg1.matrix.rotate(g_lleg1Angle,0,0,1);
    var lleg1Coord = new Matrix4(lleg1.matrix);
    lleg1.matrix.scale(-0.3,-0.7,0.4);
    lleg1.renderFast();

    var lleg2 = new Cube();
    lleg2.textureNum = -1;
    lleg2.color = [0.0,1.0,0.0,1.0];
    lleg2.matrix = lleg1Coord;
    lleg2.matrix.translate(-0.75,-.55,0.05);
    lleg2.matrix.rotate(g_lleg2Angle,0,0,1);
    var lleg2Coord = new Matrix4(lleg2.matrix);
    lleg2.matrix.scale(-0.2,-0.6,0.3);
    lleg2.renderFast();

    var lfoot = new Cube();
    lfoot.textureNum = -1;
    lfoot.color = [0.0,1.0,0.0,1.0];
    lfoot.matrix = lleg2Coord;
    lfoot.matrix.translate(-0.10,.10,-0.05);
    lfoot.matrix.rotate(g_lfootAngle,0,0,1);
    lfoot.matrix.scale(0.5,0.1,0.4);
    lfoot.renderFast();
    
    var rleg1 = new Cube();
    rleg1.textureNum = -1;
    rleg1.color = [0.0,1.0,0.0,1.0];
    rleg1.matrix.translate(xDis+0.05,yDis+0.4,zDis+-0.65);
    rleg1.matrix.rotate(g_rleg1Angle,0,0,1);
    var rleg1Coord = new Matrix4(rleg1.matrix);
    rleg1.matrix.scale(-0.3,-0.7,0.4);
    rleg1.renderFast();

    var rleg2 = new Cube();
    rleg2.textureNum = -1;
    rleg2.color = [0.0,1.0,0.0,1.0];
    rleg2.matrix = rleg1Coord;
    rleg2.matrix.translate(-0.75,-.55,0.05);
    rleg2.matrix.rotate(g_rleg2Angle,0,0,1);
    var rleg2Coord = new Matrix4(rleg2.matrix);
    rleg2.matrix.scale(-0.2,-0.6,0.3);
    rleg2.renderFast();

    var rfoot = new Cube();
    rfoot.textureNum = -1;
    rfoot.color = [0.0,1.0,0.0,1.0];
    rfoot.matrix = rleg2Coord;
    rfoot.matrix.translate(-0.10,.10,-0.05);
    rfoot.matrix.rotate(g_lfootAngle,0,0,1);
    rfoot.matrix.scale(0.5,0.1,0.4);
    rfoot.renderFast();

    var tail1 = new Cube();
    tail1.textureNum = -1;
    tail1.color = [0.0,1.0,0.0,1.0];
    tail1.matrix.translate(xDis+-.3,yDis+0,zDis+-.2);
    tail1.matrix.rotate(-tail1ZAngle,0,0.5,0);
    tail1.matrix.rotate(-g_tail1Angle,0,0,1);
    var tail1Coord = new Matrix4(tail1.matrix);
    tail1.matrix.scale(-0.6,0.3,0.3);
    tail1.renderFast();

    var tail2 = new Cube();
    tail2.textureNum = -1;
    tail2.color = [0.0,1.0,0.0,1.0];
    tail2.matrix = tail1Coord;
    tail2.matrix.translate(-0.55,.05,0.05);
    tail2.matrix.rotate(-tail2ZAngle,0,0.5,0);
    tail2.matrix.rotate(-g_tail2Angle,0,0,1);
    tail2.matrix.scale(-0.4,0.2,0.2);
    tail2.renderFast();

    var head1 = new Cube();
    head1.textureNum = -1;
    head1.color = [0.0,1.0,0.0,1.0];
    head1.matrix.translate(xDis+.35,yDis+.45,zDis+-.35);
    head1.matrix.rotate(g_head1Angle,0,.5,0);
    head1.matrix.rotate(-g_head2YAngle,0,0,1);
    head1.matrix.scale(0.6,0.2,0.6);
    head1.renderFast();

    var head2 = new Cube();
    head2.textureNum = -1;
    head2.color = [0.0,1.0,0.0,1.0];
    head2.matrix.translate(xDis+0.35,yDis+.6,zDis+-.35);
    head2.matrix.rotate(g_head2Angle,0,0.5,0);
    head2.matrix.rotate(g_head2YAngle,0,0,1);
    var head2Coord = new Matrix4(head2.matrix);
    head2.matrix.scale(0.6,0.3,0.6);
    head2.renderFast();

    
    var horn1 = new Cone();
    horn1.textureNum = -1;
    horn1.color = [.9,.9,.9];
    horn1.matrix = head2Coord;
    horn1.matrix.translate(0.15,.30,0.3);
    horn1.matrix.rotate(-90,1,0,0);
    horn1.matrix.scale(0.05,0.05,0.05);
    horn1.render();

    var horn2 = new Cone();
    horn2.textureNum = -1;
    horn2.color = [.9,.9,.9];
    horn2.matrix = head2Coord;
    horn2.matrix.translate(2.35,.0,0.0);
    horn2.render();

    var horn3 = new Cone();
    horn3.textureNum = -1;
    horn3.color = [.9,.9,.9];
    horn3.matrix = head2Coord;
    horn3.matrix.translate(2.35,.0,0.0);
    horn3.render();
    */
    
    var duration = performance.now() - startTime;
    if((Math.floor(10000/duration)/10) < lowestFPS){
        lowestFPS = Math.floor(10000/duration)/10;
    }
    console.log("lowest fps " + lowestFPS);
    sendTextToHTML(" ms  "+ Math.floor(duration)+" fps   " + Math.floor(10000/duration)/10, "performance");
}
let lowestFPS = 100;
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
function convertCoordinatesEventToGL(ev){
    var x = ev.clientX; // x coordinate of a mouse pointer
    var y = ev.clientY; // y coordinate of a mouse pointer
    var rect = ev.target.getBoundingClientRect();


    x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
    y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);

    return([x,y]);
}
function sendTextToHTML(text, htmlID){
    var HTMLElm = document.getElementById(htmlID);
    if(!HTMLElm){
        console.log("failed to get "+ htmlID + "from html");
        return;
    }

    HTMLElm.innerText = text;
}
function connectVariablesToGLSL(){
    // Initialize shaders
    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.log('Failed to intialize shaders.');
        return;
    }

    // // Get the storage location of a_Position
    a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if (a_Position < 0) {
        console.log('Failed to get the storage location of a_Position');
        return;
    }

    // // Get the storage location of a_UV
    a_UV = gl.getAttribLocation(gl.program, 'a_UV');
    if (a_Position < 0) {
        console.log('Failed to get the storage location of a_UV');
        return;
    }

    u_whichTexture = gl.getUniformLocation(gl.program, 'u_whichTexture');
    if (u_whichTexture < 0) {
        console.log('Failed to get the storage location of u_whichTexture');
        return;
    }

    u_ViewMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix');
    if (!u_ViewMatrix) {
        console.log('Failed to get the storage location of u_ViewMatrix');
        return;
    }
    u_ProjectionMatrix = gl.getUniformLocation(gl.program, 'u_ProjectionMatrix');
    if (!u_ProjectionMatrix) {
        console.log('Failed to get the storage location of u_ProjectionMatrix');
        return;
    }

    // Get the storage location of u_Sampler
    u_Sampler0 = gl.getUniformLocation(gl.program, 'u_Sampler0');
    if (!u_Sampler0) {
      console.log('Failed to get the storage location of u_Sampler0');
      return false;
    }
    u_Sampler1 = gl.getUniformLocation(gl.program, 'u_Sampler1');
    if (!u_Sampler1) {
      console.log('Failed to get the storage location of u_Sampler1');
      return false;
    }
    u_Sampler2 = gl.getUniformLocation(gl.program, 'u_Sampler2');
    if (!u_Sampler2) {
      console.log('Failed to get the storage location of u_Sampler2');
      return false;
    }

    // Get the storage location of u_FragColor
    u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
    if (!u_FragColor) {
        console.log('Failed to get the storage location of u_FragColor');
        return;
    }
    u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
    if (!u_ModelMatrix) {
        console.log('Failed to get the storage location of u_ModelMatrix');
        return;
    }

    u_GlobalRotateMatrix = gl.getUniformLocation(gl.program, 'u_GlobalRotateMatrix');
    if (!u_GlobalRotateMatrix) {
        console.log('Failed to get the storage location of u_GlobalRotateMatrix');
        return;
    }

    var identityM = new Matrix4();
    gl.uniformMatrix4fv(u_ModelMatrix, false, identityM.elements);
    
}