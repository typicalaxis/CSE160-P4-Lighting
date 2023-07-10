class Cone{
    constructor(){
        this.type = "cone";
        //this.position = [0.0,0.0,0.0];
        this.color = [1.0,1.0,1.0,1.0];
        //this.size = 5.0;
        //this.segments = 10;
        this.matrix = new Matrix4();
    }
    render(){
        //var xy = this.position;
        var rgba = this.color;
        //var size = this.size;
        // Pass the color of a point to u_FragColor variable
        
        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
        gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

        //base
        drawTriangle3DUVNormal([-1.0,-0.5,0.0, -1.0,0.5,0.0, 1.0,0.5,0.0],[0,0, 0,0, 0,0], [0,0,-1, 0,0,-1, 0,0,-1]);
        drawTriangle3DUVNormal([-1.0,-0.5,0.0, 1.0,-0.5,0.0, 1.0,0.5,0.0],[0,0, 0,0, 0,0], [0,0,-1, 0,0,-1, 0,0,-1]);

        drawTriangle3DUVNormal([-1.0,0.5,0.0, -0.5,1.0,0.0, 0.0,0.5,0.0],[0,0, 0,0, 0,0], [0,0,-1, 0,0,-1, 0,0,-1]);
        drawTriangle3DUVNormal([0.5,1.0,0.0, -0.5,1.0,0.0, 0.0,0.5,0.0],[0,0, 0,0, 0,0], [0,0,-1, 0,0,-1, 0,0,-1]);
        drawTriangle3DUVNormal([0.5,1.0,0.0, 1.0,0.5,0.0, 0.0,0.5,0.0],[0,0, 0,0, 0,0], [0,0,-1, 0,0,-1, 0,0,-1]);

        drawTriangle3DUVNormal([-1.0,-0.5,0.0, -0.5,-1.0,0.0, 0.0,-0.5,0.0],[0,0, 0,0, 0,0], [0,0,-1, 0,0,-1, 0,0,-1]);
        drawTriangle3DUVNormal([0.5,-1.0,0.0, -0.5,-1.0,0.0, 0.0,-0.5,0.0],[0,0, 0,0, 0,0], [0,0,-1, 0,0,-1, 0,0,-1]);
        drawTriangle3DUVNormal([0.5,-1.0,0.0, 1.0,-0.5,0.0, 0.0,-0.5,0.0],[0,0, 0,0, 0,0], [0,0,-1, 0,0,-1, 0,0,-1]);

        //sides
        
        drawTriangle3DUVNormal([0.5,1.0,0.0, 1.0,0.5,0.0, 0.0,0.0,2.0],[0,0, 0,0, 0,0], [-1,-1,0, -1,-1,0, -1,-1,0]);
        drawTriangle3DUVNormal([0.5,1.0,0.0, -0.5,1.0,0.0, 0.0,0.0,2.0],[0,0, 0,0, 0,0], [-1,0,0.75, -1,0,0.75, -1,0,0.75]);
        drawTriangle3DUVNormal([1.0,0.5,0.0, 1.0,-0.5,0.0, 0.0,0.0,2.0],[0,0, 0,0, 0,0], [-2,0,-1, -2,0,-1, -2,0,-1]);
        drawTriangle3DUVNormal([0.5,-1.0,0.0, 1.0,-0.5,0.0, 0.0,0.0,2.0],[0,0, 0,0, 0,0], [0,0,-1, 0,0,-1, 0,0,-1]);

        drawTriangle3DUVNormal([-0.5,-1.0,0.0, -1.0,-0.5,0.0, 0.0,0.0,2.0],[0,0, 0,0, 0,0], [0,0,-1, 0,0,-1, 0,0,-1]);
        drawTriangle3DUVNormal([0.5,-1.0,0.0, -0.5,-1.0,0.0, 0.0,0.0,2.0],[0,0, 0,0, 0,0], [0,0,-1, 0,0,-1, 0,0,-1]);
        drawTriangle3DUVNormal([-1.0,0.5,0.0, -1.0,-0.5,0.0, 0.0,0.0,2.0],[0,0, 0,0, 0,0], [0,0,-1, 0,0,-1, 0,0,-1]);
        drawTriangle3DUVNormal([-0.5,1.0,0.0, -1.0,0.5,0.0, 0.0,0.0,2.0],[0,0, 0,0, 0,0], [0,0,-1, 0,0,-1, 0,0,-1]);
                   
    }
}
