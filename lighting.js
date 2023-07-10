// Blocky Animals.js Benjamin Grinnell
// Vertex shader program
var VSHADER_SOURCE =
  `attribute vec4 a_Position;
   attribute vec2 a_UV;
   attribute vec3 a_Normal;
   varying vec2 v_UV;
   varying vec4 v_VertPos;
   varying vec3 v_Normal;
   uniform mat4 u_ModelMatrix;
   uniform mat4 u_GlobalRotateMatrix;
   uniform mat4 u_ViewMatrix;
   uniform mat4 u_ProjectionMatrix;
   void main() {
    gl_Position = u_ProjectionMatrix * u_ViewMatrix * u_GlobalRotateMatrix * u_ModelMatrix * a_Position;
    v_UV = a_UV;
    v_Normal = a_Normal;
    v_VertPos = u_ModelMatrix * a_Position;
   }`

// Fragment shader program
var FSHADER_SOURCE =
 `precision mediump float;
  uniform vec4 u_FragColor;
  varying vec2 v_UV;
  varying vec3 v_Normal;
  varying vec4 v_VertPos;
  uniform sampler2D u_Sampler0;
  uniform sampler2D u_Sampler1;  
  uniform sampler2D u_Sampler2; 
  uniform int u_whichTexture;
  uniform vec3 u_lightpos;
  void main() {
    if(u_whichTexture == -2){
        gl_FragColor = vec4((v_Normal + 1.0)/2.0,1.0);
    }
    else if(u_whichTexture == -1){
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

    vec3 lightVector = vec3(v_VertPos)-u_lightpos;
    float r = length(lightVector);
    if(r<2.0){
        gl_FragColor = vec4(0,1,0,1);
    }else if(r<3.0){
        gl_FragColor = vec4(0,0,1,1);
    }
  }`

let canvas;
let gl;
let a_Position;
let a_UV;
let a_Normal;
let u_FragColor;

let u_lightpos;
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
let g_lightPos = [0,1,-2];
let lightx = 0;
let g_NormalOn = false;
let g_LightOn = true;
function setUpHtmlUI(){
    

    document.getElementById("tail1Slide").addEventListener("mousemove",function(){if(!g_anim1){g_tail1Angle = this.value;}});
    document.getElementById("tail2Slide").addEventListener("mousemove",function(){if(!g_anim1){g_tail2Angle = this.value;}});

    document.getElementById("lightSlideX").addEventListener("mousemove",function(){g_lightPos[0] = this.value/100; lightx = this.value/100;});
    document.getElementById("lightSlideY").addEventListener("mousemove",function(){g_lightPos[1] = this.value/100;});
    document.getElementById("lightSlideZ").addEventListener("mousemove",function(){g_lightPos[2] = this.value/100;});

    document.getElementById("angleSlide").addEventListener("mousemove",function(){g_globalYAngle = this.value; renderScene();});

    document.getElementById("onButton").onclick = function(){g_anim1 = true;g_AstartTime = performance.now()/1000.0; renderScene();};
    document.getElementById("offButton").onclick = function(){g_anim1 = false};

    document.getElementById("normalOn").onclick = function(){g_NormalOn = true;};
    document.getElementById("normalOff").onclick = function(){g_NormalOn = false;};

    document.getElementById("lightOn").onclick = function(){g_LightOn = true;};
    document.getElementById("lightOff").onclick = function(){g_LightOn = false;};

    
    
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
    ProjMatrix.setPerspective(100, canvas.width/canvas.height, .1, 200 );
    gl.uniformMatrix4fv(u_ProjectionMatrix, false, ProjMatrix.elements);

    var viewMatrix = new Matrix4();
    viewMatrix.setLookAt(g_camera.eye.elements[0],g_camera.eye.elements[1],g_camera.eye.elements[2],  g_camera.at.elements[0],g_camera.at.elements[1],g_camera.at.elements[2],   g_camera.up.elements[0],g_camera.up.elements[1],g_camera.up.elements[2]); //(eye, look at, up)

    gl.uniformMatrix4fv(u_ViewMatrix, false, viewMatrix.elements);

    var globalRotMat = new Matrix4().rotate(0,1,0,0);
    globalRotMat.rotate(g_globalYAngle,0,1,0);
    gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat.elements);

    // Clear <canvas>
    gl.clear(gl.COLOR_BUFFER_BIT  | gl.DEPTH_BUFFER_BIT);

    gl.uniform3f(u_lightpos, g_lightPos[0],g_lightPos[1],g_lightPos[2]);
    
    var light = new Cube();
    light.textureNum = -1;
    light.color = [2.0,2.0,0.0,1.0];
    light.matrix.translate(g_lightPos[0],g_lightPos[1],g_lightPos[2]);
    light.matrix.scale(1,1,1);
    light.matrix.translate(-.5,-.5,-.5);
    light.renderFast();

    var floor = new Cube();
    floor.textureNum = 1;
    floor.color = [1.0,1.0,1.0,1.0];
    floor.matrix.scale(100,1,100);
    floor.matrix.translate(-.5,-1.75,-.5);
    floor.renderFast();

    var sky = new Cube();
    sky.textureNum = -1;
    sky.color = [0.0,0.0,1.0,1.0];
    sky.matrix.scale(100,100,100);
    sky.matrix.translate(-.5,-0.5,-.5);
    sky.renderFast();


    
   
    var cu = new Cube();
    if(g_NormalOn){
        cu.textureNum = -2;
    }
    cu.matrix.scale(5,5,5);
    cu.matrix.translate(-3,0,-2);
    cu.renderFast();

    var sp = new Sphere();
    if(g_NormalOn){
        sp.textureNum = -2;
    }else{
        sp.textureNum = -1;
    }
    sp.matrix.scale(5,5,5);
    sp.matrix.translate(4,1,-2);
    sp.render();
    //drawMap();
    



    
    var duration = performance.now() - startTime;
    if((Math.floor(10000/duration)/10) < lowestFPS){
        lowestFPS = Math.floor(10000/duration)/10;
    }
    console.log("lowest fps " + lowestFPS);
    sendTextToHTML(" ms  "+ Math.floor(duration)+" fps   " + Math.floor(10000/duration)/10, "performance");
}
let lowestFPS = 100;
function updateAnimationAngles(){
    g_lightPos[0] = Math.cos(g_seconds)+lightx;
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
    a_Normal = gl.getAttribLocation(gl.program, 'a_Normal');
    if (a_Normal < 0) {
        console.log('Failed to get the storage location of a_Normal');
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
    u_lightpos = gl.getUniformLocation(gl.program, 'u_lightpos');
    if (!u_lightpos) {
        console.log('Failed to get the storage location of u_lightpos');
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