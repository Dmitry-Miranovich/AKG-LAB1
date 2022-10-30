
class FaceComponent{
    /**
     *
     * @param {number[]} values
     */
    constructor(values) {
        this.values = values
    }

    length =()=>{
        return this.values.length
    }

    toString=()=>{
    console.log(this.values)
    }

    getElem = (index)=>{
        return this.values[index]
    }
}

export default FaceComponent