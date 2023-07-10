class Cube{
    constructor(){
        this.type = "cube";
        //this.position = [0.0,0.0,0.0];
        this.color = [1.0,1.0,1.0,1.0];
        //this.size = 5.0;
        //this.segments = 10;
        this.matrix = new Matrix4();
        this.normalMatrix = new Matrix4();
        this.textureNum=0;
    }
    render(){
        //var xy = this.position;
        var rgba = this.color;
        //var size = this.size;

        gl.uniform1i(u_whichTexture, this.textureNum);
        // Pass the color of a point to u_FragColor variable
        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

        gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

        //front
        drawTriangle3DUV([0.0,0.0,0.0, 1.0,1.0,0.0, 1.0,0.0,0.0],[0,0, 1,1, 1,0]);
        drawTriangle3DUV([0.0,0.0,0.0, 0.0,1.0,0.0, 1.0,1.0,0.0],[0,0, 0,1, 1,1]);
        //left
        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

        drawTriangle3DUV([0.0,0.0,0.0, 0.0,0.0,1.0, 0.0,1.0,0.0],[1,0, 0,0, 1,1]);
        drawTriangle3DUV([0.0,0.0,1.0, 0.0,1.0,1.0, 0.0,1.0,0.0],[0,0, 0,1, 1,1]);
        //right
        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

        drawTriangle3DUV([1.0,0.0,0.0, 1.0,0.0,1.0, 1.0,1.0,1.0],[0,0, 1,0, 1,1]);
        drawTriangle3DUV([1.0,0.0,0.0, 1.0,1.0,0.0, 1.0,1.0,1.0],[0,0, 0,1, 1,1]);
        //top
        drawTriangle3DUV([0.0,1.0,0.0, 1.0,1.0,0.0, 1.0,1.0,1.0],[0,0, 1,0, 1,1]);
        drawTriangle3DUV([0.0,1.0,0.0, 0.0,1.0,1.0, 1.0,1.0,1.0],[0,0, 0,1, 1,1]);
        //bottom
        drawTriangle3DUV([0.0,0.0,0.0, 1.0,0.0,0.0, 1.0,0.0,1.0],[0,0, 1,0, 1,1]);
        drawTriangle3DUV([0.0,0.0,0.0, 0.0,0.0,1.0, 1.0,0.0,1.0],[0,0, 0,1, 1,1]);
        //back
        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

        drawTriangle3DUV([0.0,1.0,1.0, 1.0,1.0,1.0, 1.0,0.0,1.0],[1,1, 0,1, 0,0]);
        drawTriangle3DUV([0.0,1.0,1.0, 0.0,0.0,1.0, 1.0,0.0,1.0],[1,1, 1,0, 0,0]);        
    }
    renderFast(){
        //var xy = this.position;
        var rgba = this.color;
        //var size = this.size;

        gl.uniform1i(u_whichTexture, this.textureNum);
        // Pass the color of a point to u_FragColor variable

        gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

        gl.uniformMatrix4fv(u_NormalMatrix, false, this.normalMatrix.elements);

        gl.uniform4f(u_FragColor, rgba[0]*0.9, rgba[1]*0.9, rgba[2]*0.9, rgba[3]);

        var allverts = [];
        var alluvs = [];
        var allNormals = [];
        //front
        allverts = allverts.concat([0.0,0.0,0.0, 1.0,1.0,0.0, 1.0,0.0,0.0]);
        alluvs = alluvs.concat([0,0, 1,1, 1,0]);
        allNormals = allNormals.concat([0,0,-1, 0,0,-1, 0,0,-1]);
        allverts = allverts.concat([0.0,0.0,0.0, 0.0,1.0,0.0, 1.0,1.0,0.0]);
        alluvs = alluvs.concat([0,0, 0,1, 1,1]);
        allNormals = allNormals.concat([0,0,-1, 0,0,-1, 0,0,-1]);

        //left
        allverts = allverts.concat([0.0,0.0,0.0, 0.0,0.0,1.0, 0.0,1.0,0.0]);
        alluvs = alluvs.concat([1,0, 0,0, 1,1]);
        allNormals = allNormals.concat([-1,0,0, -1,0,0, -1,0,0]);
        allverts = allverts.concat([0.0,0.0,1.0, 0.0,1.0,1.0, 0.0,1.0,0.0]);
        alluvs = alluvs.concat([0,0, 0,1, 1,1]);
        allNormals = allNormals.concat([-1,0,0, -1,0,0, -1,0,0]);

        //right
        allverts = allverts.concat([1.0,0.0,0.0, 1.0,0.0,1.0, 1.0,1.0,1.0]);
        alluvs = alluvs.concat([0,0, 1,0, 1,1]);
        allNormals = allNormals.concat([1,0,0, 1,0,0, 1,0,0]);
        allverts = allverts.concat([1.0,0.0,0.0, 1.0,1.0,0.0, 1.0,1.0,1.0]);
        alluvs = alluvs.concat([0,0, 0,1, 1,1]);
        allNormals = allNormals.concat([1,0,0, 1,0,0, 1,0,0]);
        
        //top
        allverts = allverts.concat([0.0,1.0,0.0, 1.0,1.0,0.0, 1.0,1.0,1.0]);
        alluvs = alluvs.concat([0,0, 1,0, 1,1]);
        allNormals = allNormals.concat([0,1,0, 0,1,0, 0,1,0]);
        allverts = allverts.concat([0.0,1.0,0.0, 0.0,1.0,1.0, 1.0,1.0,1.0]);
        alluvs = alluvs.concat([0,0, 0,1, 1,1]);
        allNormals = allNormals.concat([0,1,0, 0,1,0, 0,1,0]);
       
        //bottom
        allverts = allverts.concat([0.0,0.0,0.0, 1.0,0.0,0.0, 1.0,0.0,1.0]);
        alluvs = alluvs.concat([0,0, 1,0, 1,1]);
        allNormals = allNormals.concat([0,-1,0, 0,-1,0, 0,-1,0]);
        allverts = allverts.concat([0.0,0.0,0.0, 0.0,0.0,1.0, 1.0,0.0,1.0]);
        alluvs = alluvs.concat([0,0, 0,1, 1,1]);
        allNormals = allNormals.concat([0,-1,0, 0,-1,0, 0,-1,0]);

        //back
        allverts = allverts.concat([0.0,1.0,1.0, 1.0,1.0,1.0, 1.0,0.0,1.0]);
        alluvs = alluvs.concat([1,1, 0,1, 0,0]);
        allNormals = allNormals.concat([0,0,1, 0,0,1, 0,0,1]);
        allverts = allverts.concat([0.0,1.0,1.0, 0.0,0.0,1.0, 1.0,0.0,1.0]);
        alluvs = alluvs.concat([1,1, 1,0, 0,0]);
        allNormals = allNormals.concat([0,0,1, 0,0,1, 0,0,1]);
        drawTriangle3DUVNormal(allverts,alluvs,allNormals);
    }
}
