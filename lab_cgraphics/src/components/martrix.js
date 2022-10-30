import {MatrixMode} from "./mode"

class Matrix{

    #mode=MatrixMode.COLUMN
    /**
     *
     * @param {number[][]} values
     */
    constructor(values) {
        this.values = values
    }

    getRow = (index)=>{
        if(this.#mode === MatrixMode.ROW){
            return this.values[index]
        }else{
            if(this.length() > 1){
                return this.values.map((elem, index2)=>{
                    return elem[index]
                })
            }else{
                return this.values[0][index]
            }
        }
    }
    getColumn = (index)=>{
        if(this.#mode === MatrixMode.ROW){
            if(this.length() > 1){
                return this.values.map((elem, index2)=>{
                    return elem[index]
                })
            }else{
                return this.values[0][index]
            }
        }else{
            return this.values[index]
        }
    }
    getElem = (i1, i2) =>{
        return this.values[i1][i2]
    }
    length = ()=>{
        return this.values.length
    }
    toString = ()=>{
        console.log(this.values)
    }
    set mode(mode){
        this.#mode = mode
    }
    get mode(){return this.#mode}
}
export default Matrix