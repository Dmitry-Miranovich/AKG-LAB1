import Vertex from "../components/vertex"
import Triangle from "../components/triangle"
import Matrix from "../components/martrix";
import FaceComponent from "../components/faceComponent";
import {MatrixMode, ObjectElements} from "../components/mode";

/**
 *
 * @param {string} data
 * @param {RegExp} regex
 * @param {RegExp} separator
 */

export const verticalParser = (data ,regex, separator)=>{
    const array = Array.from(data.matchAll(regex))
    return array.map((elem)=>{
        const param = elem[1].split(separator)

        return new FaceComponent(param.map(elem=>{
            return parseFloat(elem)
        }))
    })
}
/**
 *
 * @param {string} data
 * @param {RegExp} regex
 * @param {RegExp} separator
 * @param {number} mode
 */
export const parser = (data, regex, separator, mode)=>{
    const fixString = (groups)=>{
        const fixed_string = []
        groups.forEach(elem=>{
            if(elem !== ''){
                fixed_string.push(elem)
            }
        })
        return fixed_string
    }
    function get_vertexes(param) {
        return new FaceComponent(param.map(elem=>{
            return parseFloat(elem)
        }))
    }
    function get_faces(param){
        return new FaceComponent(param.map(elem=>{
            const f_values = elem.split(separator)
            return parseFloat(f_values[0])
        }))
    }
    const array = Array.from(data.matchAll(regex))
    const components = []
    array.forEach(elem=>{
        const param = fixString(elem[1].split(/[\s]+/))
        if(param.length > 0){
            const results = new Map([
                [ObjectElements.V,get_vertexes(param)],
                [ObjectElements.F, get_faces(param)]
            ])
            components.push(results.get(mode))
        }
    })
    return components
}

/**
 *
 * @param {Vertex[]} vertexes
 * @param {object[]} positions
 */

export const createTriangles = (vertexes, positions)=>{
    const triangle_array = []
    positions.forEach(elem=>{
        triangle_array.push(new Triangle(vertexes[elem.x], vertexes[elem.y], vertexes[elem.z]))
    })
    return triangle_array
}
/**
 *
 * @param {Matrix} matrix1
 * @param  {Matrix} matrix2
 * @return {Matrix}
 */
export const matrixMultiplication = (matrix1, matrix2)=>{
    if(matrix1.length() >= matrix2.length()){
        matrix1.mode = MatrixMode.ROW
        matrix2.mode = MatrixMode.COLUMN
    }else{
        matrix1.mode = MatrixMode.ROW
        matrix2.mode = MatrixMode.ROW
    }
    const result_matrix = new Matrix([])
        for(let i = 0; i< matrix1.length(); i++){
            const row = matrix1.getRow(i)
            const result_matrix_row = []
            for(let j = 0; j<matrix2.length(); j++){
                const column = matrix2.getColumn(j)
                const values =  row.map((elem, index)=>{
                    return elem * column[index]
                })
                let elem_value = 0
                values.forEach(elem=>{elem_value+=elem})
                result_matrix_row.push(elem_value)
            }
            result_matrix.values.push(result_matrix_row)
        }
    return result_matrix
}

/**
 *
 * @param {Matrix} matrix1
 * @param {Matrix} matrix2
 * @return {Matrix}
 */
export const matrix_multiplication = (matrix1, matrix2)=>{
    let result_matrix = []
    let flag = false
    if(matrix1.values.length === matrix2.values.length ||
        matrix1.values.length < matrix2.values.length){
        matrix1.mode = MatrixMode.ROW
        matrix2.mode = MatrixMode.ROW
        flag = true
    }else{
        matrix1.mode = MatrixMode.ROW
        matrix2.mode = MatrixMode.COLUMN
        flag = false
    }

    for(let i = 0; i<matrix1.values.length; i++){
        const row = matrix1.getRow(i), row_temp = []
        for(let j = 0; j<matrix2.length(); j++){
            const column = matrix2.getColumn(j)
            let matrix_value = 0
            const multiplied_values = row.map((elem, index)=>{
                return elem * column[index]
            })
            multiplied_values.forEach(elem=>{
                matrix_value+=elem
            })
            row_temp.push(matrix_value)
        }
            result_matrix.push(row_temp)
    }
    if(!flag){
        result_matrix = [result_matrix.map((elem)=>{
            return elem[0]
        })]
    }
    return new Matrix(result_matrix)
}

/**
 *
 * @param {number[]} array
 */
export const normalize =(array)=>{
    let length = 0
    array.forEach(elem=>{
        length += elem**2
    })
    length = 1/Math.sqrt(length)
    return array.map(elem=>{
        return elem * length
    })
}
/**
 * @name divide_array
 * @param {number[]} a
 * @param {number[]} b
 */
export const divide_array = (a,b)=>{
    return a.map((elem, index)=>{
     return elem - b[index]
    })
}
/**
 * @name multiply_array
 * @param {number[]} a
 * @param {number[]} b
 */
export const vector_multiply_array = (a,b)=>{
    const elem1 = (a[1]*b[2] - a[2]*b[1])
    const elem2 = -(a[2]*b[0] - a[0]*b[2])
    const elem3 = (a[0]*b[1] - a[1]*b[0])
    return [elem1,elem2,elem3]
}
/**
 * @name multiply_array
 * @param {number[]} a
 * @param {number} b
 */
const digit_multiply_array = (a,b)=>{
    return a.map(elem =>{
        return elem * b
    })
}
/**
 *
 * @param {number[]} array_first
 * @param {number[]} array_second
 * @return {number}
 */
const multiply_array = (array_first, array_second) =>{
    let total_sum = 0
    array_first.forEach((elem, index)=>{
        total_sum+=elem * array_second[index]
    })
    return total_sum
}

/**
 *
 * @param eye
 * @param target
 * @param up
 * @returns {Matrix}
 */
export const get_view_matrix = (eye, target, up)=>{
    const zAxis = normalize(divide_array(eye, target))
    const xAxis = normalize(vector_multiply_array(zAxis,up))
    const yAxis = (vector_multiply_array(zAxis, xAxis))
    return new Matrix([
        [xAxis[0], xAxis[1], xAxis[2], -(multiply_array(xAxis, eye))],
        [yAxis[0], yAxis[1], yAxis[2], -(multiply_array(yAxis, eye))],
        [zAxis[0], zAxis[1], zAxis[2], -(multiply_array(zAxis, eye))],
        [0,0,0,1]
    ])
}

export const get_projection_matrix = (fov, z_near, z_far)=>{
    const stage=document.getElementById("stageContainerId")
    const width = stage.offsetWidth, height = stage.offsetHeight
    const aspect = height / width
    return new Matrix( [
        [1/(aspect * Math.tan(Math.PI * (fov / 2) / 180.0)),0,0,0],
        [0,1/ Math.tan(Math.PI * (fov / 2) / 180.0),0,0],
        [0,0,z_far / (z_near-z_far), z_near * z_far / (z_near-z_far)],
        [0,0,-1,0]
    ])
}
export const get_o_graphic_projection_matrix =()=>{
    const width = 110, height = 50
    const z_near = 30, z_max = 70
    return new Matrix([
        [2/width, 0,0,0],
        [0,2/height, 0,0],
        [0,0,1/(z_near - z_max),z_near / (z_near-z_max)],
        [0,0,0,1]
    ])
}

export const get_window_of_view = (x_min, y_min)=>{
    const stage=document.getElementById("stageContainerId")
    const width = stage.offsetWidth, height = stage.offsetHeight
    return new Matrix( [
        [width/2, 0,0,x_min + (width/2)],
        [0,-(height/2),0,y_min + (height/2)],
        [0,0,1,0],
        [0,0,0,1]
    ])
}
/**
 * @name convert_vertex
 * @param {Vertex} vertex
 */
export const convert_vertex = (vertex)=>{
    return {
        x: vertex.x,
        y: vertex.y
    }
}

/**
 *
 * @param {Matrix} matrix
 * @description Завершающий этап матрицы проекции
 */
export const finalize_projection_vector = (matrix)=>{
    const elem1 = matrix.getElem(0,0) / matrix.getElem(0,3)
    const elem2 = matrix.getElem(0,1) / matrix.getElem(0,3)
    const elem3 = matrix.getElem(0,2) / matrix.getElem(0,3)
    const elem4 = matrix.getElem(0,3) / matrix.getElem(0,3)
    return new Matrix([[elem1, elem2, elem3, elem4]])
}

export const createUpVector = (eye, target)=>{
    const directed_vector = vector_multiply_array(eye, target)
    const y = 1, z = 0
    const x = -(directed_vector[2]*z + directed_vector[1]*y)/ (directed_vector[0])
    return [x,y,z]
}
/**
 *
 * @param{Object} vector1
 * @param {Object} vector2
 * @param {Context} ctx
 */
export const dda_algorithm = (vector1, vector2, ctx)=>{
    const x0 = vector2.x - vector1.x
    const y0 = vector2.y - vector1.y
    const l = Math.round(Math.max(Math.abs(x0), Math.abs(y0)))
    for(let i = 0; i<l; i++){
        
    }
}

