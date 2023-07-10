class Sphere{
    constructor(){
        this.type = "sphere";
        //this.position = [0.0,0.0,0.0];
        this.color = [1.0,1.0,1.0,1.0];
        //this.size = 5.0;
        //this.segments = 10;
        this.matrix = new Matrix4();
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

        var d = Math.PI/10;    
        var dd = Math.PI/10; 

        for(var t = 0; t<Math.PI; t+=d){
            for(var r = 0; r<(2*Math.PI); r+=d){
                var p1 = [Math.sin(t)*Math.cos(r), Math.sin(t)*Math.sin(r), Math.cos(t)]; 
                var p2 = [Math.sin(t+dd)*Math.cos(r), Math.sin(t+dd)*Math.sin(r), Math.cos(t+dd)];
                var p3 = [Math.sin(t)*Math.cos(r+dd), Math.sin(t)*Math.sin(r+dd), Math.cos(t)];
                var p4 = [Math.sin(t+dd)*Math.cos(r+dd), Math.sin(t+dd)*Math.sin(r+dd), Math.cos(t+dd)];

                var uv1 = [t/Math.PI, r/(2*Math.PI)]; 
                var uv2 = [(t+dd)/Math.PI, r/(2*Math.PI)];
                var uv3 = [t/Math.PI, (r+dd)/(2*Math.PI)];
                var uv4 = [(t+dd)/Math.PI, (r+dd)/(2*Math.PI)];
            
                var v = [];
                var uv = [];
                v = v.concat(p1); uv = uv.concat(uv1);
                v = v.concat(p2); uv = uv.concat(uv2);
                v = v.concat(p4); uv = uv.concat(uv4);
                gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
                drawTriangle3DUVNormal(v,uv,v);

                v = [];
                uv = [];
                v = v.concat(p1); uv = uv.concat(uv1);
                v = v.concat(p4); uv = uv.concat(uv4);
                v = v.concat(p3); uv = uv.concat(uv3);
                gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
                drawTriangle3DUVNormal(v,uv,v);
            }
        }
    }
    renderFast(){
        //var xy = this.position;
        var rgba = this.color;
        //var size = this.size;

        gl.uniform1i(u_whichTexture, this.textureNum);
        // Pass the color of a point to u_FragColor variable

        gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

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
        drawTriangle3DUV(allverts,alluvs);
    }
}
