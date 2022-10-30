class Triangle {
    /**
     *
     * @param {Vertex} pos1
     * @param {Vertex} pos2
     * @param {Vertex} pos3
     */
    constructor(pos1, pos2, pos3) {
        this.pos1 = pos1
        this.pos2 = pos2
        this.pos3 = pos3
    }
    static width = window.innerWidth
    static height = window.innerHeight

    #viewportCanvas =  (x,y)=>{
        return {x: x, y: y}
    }
    /**
     *
     * @param {Vertex} vertex
     * @param {Camera} camera
     */
    parseVertexToXY(camera, vertex){
        const yawn = camera.yawn(vertex), pitch = camera.pitch(vertex), fov = camera.getFOV().value
        return {x: Triangle.width / 2 + (pitch * (Triangle.width / fov)),
                y: Triangle.height / 2 + (yawn * (Triangle.height / fov)),}
    }



    toString(){
        console.log(this.pos1, this.pos2, this.pos3)
    }
}

export default Triangle