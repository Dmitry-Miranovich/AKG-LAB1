
class Camera{
    constructor(x,y,z) {
        this.x = x
        this.y = y
        this.z = z
    }

    getFOV = ()=>{
        return{value: 2}
    }
    /**
     * @param {Vertex}vertex
     */
    pitch = (vertex)=>{
        return Math.atan((vertex.x - this.x) / (vertex.y - this.y))
    }
    /**
     *
     * @param {Vertex} vertex
     */
    yawn = (vertex)=>{
        return Math.atan((vertex.z - this.z) / (vertex.y - this.y))
    }
}
export default Camera