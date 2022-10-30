import Matrix from "../components/martrix";
import Vertex from "../components/vertex";
import Camera from "../components/camera";

import {normalize} from "./sample";


/**
 * @name get_movement_matrix
 * @param {Vertex} translation
 */
export const get_movement_matrix = (translation)=>{
    return new Matrix([
        [1,0,0,translation.x],
        [0,1,0,translation.y],
        [0,0,1,translation.z],
        [0,0,0,1]
    ])
}
/**
 * @name get_scale_matrix
 * @param {Vertex} scale
 */
export const get_scale_matrix = (scale)=>{
    return new Matrix([
        [scale.x,0,0,0],
        [0,scale.y,0,0],
        [0,0,scale.z,0],
        [0,0,0,1]
    ])
}
/**
 * @name get_rotate_x_matrix
 * @param {number} angle
 * @return {Matrix}
 */
export const get_rotate_x_matrix =(angle)=>{
    const cos_angle = Math.cos(Math.PI * angle / 180.0)
    const sin_angle = Math.sin(Math.PI * angle / 180.0)
    return new Matrix([
        [1,0,0,0],
        [0,cos_angle, -sin_angle,0],
        [0,sin_angle, cos_angle, 0],
        [0,0,0,1]
    ])
}
/**
 * @name get_rotate_y_matrix
 * @param angle
 * @returns {Matrix}
 */
export const get_rotate_y_matrix = (angle)=> {
    const cos_angle = Math.cos(Math.PI * angle / 180.0)
    const sin_angle = Math.sin(Math.PI * angle / 180.0)
    return new Matrix([
        [cos_angle, 0, sin_angle, 0],
        [0,1,0,0],
        [-sin_angle, 0, cos_angle,0],
        [0,0,0,1]
        ]
    )
}
/**
 * @name get_rotate_z_matrix
 * @param {number} angle
 * @returns {Matrix}
 */
export const get_rotate_z_matrix = (angle)=>{
    const cos_angle = Math.cos(Math.PI * angle / 180.0)
    const sin_angle = Math.sin(Math.PI * angle / 180.0)
    return new Matrix([
        [cos_angle, -sin_angle, 0,0],
        [sin_angle, cos_angle, 0,0],
        [0,0,1,0],
        [0,0,0,1]
    ])
}

export const get_world_coordinate_matrix = (movement, scale, angle1, angle2, angle3)=>{
    const n_cos = (angle)=>{return Math.cos(Math.PI * angle / 180.0)}
    const n_sin = (angle)=>{return Math.sin(Math.PI * angle / 180.0)}
    const xAxis = [scale.x * n_cos(angle2)*n_cos(angle3), scale.y*-n_sin(angle1)*-n_sin(angle2)*n_cos(angle3) + scale.y*n_cos(angle1)*n_sin(angle3),
    scale.z*n_cos(angle1)*-n_sin(angle2)*n_cos(angle3)+scale.z*n_sin(angle1)*n_sin(angle3),0]
    const yAxis = [scale.x * n_cos(angle2)*-n_sin(angle3), scale.y*-n_sin(angle1)*-n_sin(angle2)*-n_sin(angle3) + scale.y*n_cos(angle1)*n_cos(angle3),
        scale.z*n_cos(angle1)*-n_sin(angle2)*-n_sin(angle3)+scale.z*n_sin(angle1)*n_cos(angle3),0]
    const zAxis = [scale.x * n_sin(angle2) , scale.y*-n_sin(angle1)*n_cos(angle2),
        scale.z*n_cos(angle1)*n_cos(angle2),0]
    return new Matrix([
        [xAxis[0],yAxis[0],zAxis[0],movement.x],
        [xAxis[1],yAxis[1],zAxis[1],movement.y],
        [xAxis[2],yAxis[2],zAxis[2],movement.z],
        [0,0,0,1],
    ])
}
/**
 *
 * @param {number} angle
 * @param {Vertex} cam
 * @return {Vertex}
 */
export const convert_cam_by_pitch = (angle, cam)=>{
    const vector_length = cam.getLength()
    const iz_angled = Math.sin(Math.PI * angle / 180.0)
    //console.log(Math.asin(cam.z / vector_length) * 180.0 / Math.PI)
    return new Vertex(cam.x, cam.y, iz_angled * vector_length)
}
export const convert_cam_by_yawn = (angle, cam)=>{
    const get_angle= (angle)=>{return Math.PI * angle / 180.0}
    const normalized1 = normalize([1,42,21])
    console.log(Math.tan(get_angle(1)), Math.tan(get_angle(2)),Math.tan(get_angle(3)))
    console.log(Math.tan(get_angle(2)) - Math.tan(get_angle(1)), Math.tan(get_angle(3)) - Math.tan(get_angle(2)))
    const division = Math.atan(normalized1[1]/normalized1[0]) * 180.0 / Math.PI
    console.log(division)
}
export const convert_cam_by_roll = (angle, cam)=>{

}
