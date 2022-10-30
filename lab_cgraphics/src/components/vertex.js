class Vertex{
    constructor(x,y,z) {
        this.x = x
        this.y = y
        this.z = z
    }

    toString(){
        console.log(this.x, this.y, this.z)
    }

    getLength(){
        return Math.sqrt(this.x**2 + this.y**2 + this.z**2)
    }

}
export default Vertex