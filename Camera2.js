class Camera{
    constructor(){
        this.eye = new Vector3([0,0,3]);
        this.at = new Vector3([0,0,-1]);
        this.up = new Vector3([0,1,0]);
    }
    moveForwards(){
        var d = new Vector3([0,0,0]);
        d.set(this.at);
        d.sub(this.eye);
        d.normalize();
        this.at.add(d);
        this.eye.add(d);
    }
    moveBackwards(){
        var d = new Vector3([0,0,0]);
        d.set(this.at);
        d.sub(this.eye);
        d.normalize();
        this.at.sub(d);
        this.eye.sub(d);
    }
    moveLeft(){
        var d = new Vector3([0,0,0]);
        d.set(this.at);
        d.sub(this.eye);

        var left = Vector3.cross(d, this.up);
        left.normalize();
        this.at.sub(left);
        this.eye.sub(left);
    }
    moveRight(){
        var d = new Vector3([0,0,0]);
        d.set(this.at);
        d.sub(this.eye);

        var right = Vector3.cross(d, this.up);
        right.normalize();
        this.at.add(right);
        this.eye.add(right);
    }
    rotateLeft(){
        var d = new Vector3([0,0,0]);
        d.set(this.at);
        d.sub(this.eye);

        var rotMat = new Matrix4().setRotate(5, this.up.elements[0],this.up.elements[1],this.up.elements[2]);
        var dprime = rotMat.multiplyVector3(d);
        
        this.at.set(new Vector3([dprime.elements[0],dprime.elements[1],dprime.elements[2]]));
        this.at.add(this.eye);
    }
    rotateRight(){
        var d = new Vector3([0,0,0]);
        d.set(this.at);
        d.sub(this.eye);

        var rotMat = new Matrix4().setRotate(-5, this.up.elements[0],this.up.elements[1],this.up.elements[2]);
        var dprime = rotMat.multiplyVector3(d);

        this.at.set(new Vector3([dprime.elements[0],dprime.elements[1],dprime.elements[2]]));
        this.at.add(this.eye);
    }
    mouseRotate(a){
        var d = new Vector3([0,0,0]);
        d.set(this.at);
        d.sub(this.eye);

        var rotMat = new Matrix4().setRotate(a*3, this.up.elements[0],this.up.elements[1],this.up.elements[2]);
        var dprime = rotMat.multiplyVector3(d);
        
        this.at.set(new Vector3([dprime.elements[0],dprime.elements[1],dprime.elements[2]]));
        this.at.add(this.eye);
    }
    
}