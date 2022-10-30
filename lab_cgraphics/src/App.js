import './App.css';
import './style/lab.css'
import React, {useEffect, useState} from "react";
import {Form, Button} from "react-bootstrap";
import {Stage,Layer,Shape} from "react-konva";
import {verticalParser, parser,createTriangles,matrixMultiplication,
  get_view_matrix, get_projection_matrix,
  get_window_of_view, get_o_graphic_projection_matrix,
  convert_vertex, finalize_projection_vector, createUpVector, matrix_multiplication, normalize} from "./scripts/sample";
import {get_world_coordinate_matrix, get_rotate_x_matrix,
    get_scale_matrix, get_rotate_z_matrix, get_rotate_y_matrix,
    get_movement_matrix, convert_cam_by_pitch,convert_cam_by_yawn} from "./scripts/world_coordinates";
import Vertex from "./components/vertex";
import Matrix from "./components/martrix";
import {ObjectElements} from "./components/mode";

function App() {

  const [isFileLoaded, setIsFileLoaded] = useState(false)

    const [isDrawingStarted, setIsDrawingStarted] = useState(false)

  const [vertex, setVertex] = useState({
    array1: [],
    array2: [],
    array3: []
  })
    convert_cam_by_yawn()
  const [camera, setCamera] = useState({
    x: -1.346,
    y: 24.568,
    z: 47.543
  })
  const [movement,setMovement] = useState({
    x: 0,
    y: 0,
    z: 0
  })
  const [rotate, setRotate] = useState({
    x: 30,
    y: 20,
    z: 10
  })
    const [scale,setScale] = useState({
        x: 1,
        y: 1,
        z: 1
    })
  const [normalVectors, setNormalVectors] = useState({
    value: []
  })
  const cameraOnChangeHandler = (e)=>{
    setCamera({
      x: (e.target.name==="x-value")? e.target.value: camera.x,
      y: (e.target.name === "y-value")? e.target.value: camera.y,
      z: (e.target.name === "z-value")? e.target.value: camera.z,
    })
  }
  const movementOnChangeHandler = (e)=>{
    setMovement({
      x: (e.target.name==="x-value-movement")? e.target.value: movement.x,
      y: (e.target.name === "y-value-movement")? e.target.value: movement.y,
      z: (e.target.name === "z-value-movement")? e.target.value: movement.z,
    })
  }
  const rotateOnChangeHandler = (e)=>{
    setRotate({
      x: (e.target.name==="x-value-rotate")? e.target.value: rotate.x,
      y: (e.target.name === "y-value-rotate")? e.target.value: rotate.y,
      z: (e.target.name === "z-value-rotate")? e.target.value: rotate.z,
    })
  }
  const scaleOnChangeHandler = (e)=>{
      setScale({
          x: (e.target.name==="x-value-scale")? e.target.value: scale.x,
          y: (e.target.name === "y-value-scale")? e.target.value: scale.y,
          z: (e.target.name === "z-value-scale")? e.target.value: scale.z,
      })
  }

  const showFile = (e)=>{
    let file = e.target.files[0]
    let reader = new FileReader()
    reader.readAsText(file)
    reader.onload = ()=>{
        console.log(reader.result)
      const regex1 = /v\s+([0-9,.\s\\-]*\n)/g, regex2 = /vn\s+([0-9,.\s\\-]*\n)/g, regex3 = /f\s+([0-9,.\s\\\/]+)/g
        const separator1 = /[\/]+/, separator2 = /[\s]+/
      const vertex_array_one = parser(reader.result, regex1, separator2, ObjectElements.V)
      const vertex_array_two = []
      const vertex_array_three = parser(reader.result, regex3, separator1, ObjectElements.F)
      setVertex({
        array1: vertex_array_one,
        array2: vertex_array_two,
        array3: vertex_array_three
      })
    }
    reader.onerror = ()=>{
      console.log(reader.error)
    }
  }
  const calculate_view_matrix = ()=>{
    const target = [0,10,0]
      //createUpVector([camera.x, camera.y,camera.z],target)
    const up = [0,-1,0]
      const a_camera = convert_cam_by_pitch(64.63716016716436, new Vertex(camera.x, camera.y, camera.z))
    return get_view_matrix([a_camera.x, a_camera.y, a_camera.z], target, up)
  }

  const calculate_projection_matrix = ()=>{
    const fov = 60
    const z_near = 0.1, z_far = 1000
    return get_projection_matrix(fov, z_near, z_far)
  }
  const calculate_window_of_view = ()=>{
    const x_min = 0, y_min = 0
    return get_window_of_view(x_min, y_min)
  }
  const parse_vector = ()=>{
      const vectors = []
      vertex.array1.forEach(elem=>{
          /**
          @description Создаю класс Матрицы из xyz координат одной точки + w = 1
           */
          const matrix_vertex = new Matrix([[elem.getElem(0), elem.getElem(1), elem.getElem(2), 1]])
          /**
           * @type {Matrix}
           * @description Перевожу локальные координаты вектора-столбца в мировые одной матрицой
           */
          const multiplication0 = convert_to_world_coordinate(matrix_vertex)
          /**
           * @type {Matrix}
           * @description Перевожу мировые координаты в пространство наблюдателя
           */
          const multiplication1 = matrix_multiplication(calculate_view_matrix(),multiplication0)
          /**
           * @type {Matrix}
           * @description Перевожу пространство наблюдателя в пространство проекции
           */
          const multiplication2 = finalize_projection_vector(matrix_multiplication(calculate_projection_matrix(), multiplication1))
          /**
           * @type {Matrix}
           * @description Перевожу пространтсво проецкии в пространство окна просмотра
           */
          const multiplication3 = matrix_multiplication(calculate_window_of_view(),multiplication2)
          /**
           * @type {{x, y}}
           * @description Получаю обычный вектор xy
           */
          const normal_vector = convert_vertex(new Vertex(multiplication3.getElem(0,0), multiplication3.getElem(0,1),
              multiplication3.getElem(0,2)))
          vectors.push(normal_vector)
      })
      return vectors
  }
  const convert_to_world_coordinate = (matrix_vector)=>{
      return matrix_multiplication(get_world_coordinate_matrix(movement, scale, rotate.x, rotate.y, rotate.z), matrix_vector)
  }
  const convert_to_world_coordinate1 = (matrix_vector)=>{
      const movement_v = new Vertex(movement.x, movement.y, movement.z);
      const scale_v = new Vertex(scale.x, scale.y, scale.z);
      const rotate1 = rotate.x
      const rotate2 = rotate.y
      const rotate3 = rotate.z
      return matrix_multiplication(matrix_multiplication(matrix_multiplication(matrix_multiplication(matrix_multiplication(get_movement_matrix(movement_v), get_scale_matrix(scale_v)), get_rotate_x_matrix(rotate1)), get_rotate_y_matrix(rotate2)), get_rotate_z_matrix(rotate3)),matrix_vector)
  }
  useEffect(()=>{
      const promise = new Promise(((resolve, reject) => {
          resolve("result")
          reject("error")
      })),vectors = isDrawingStarted && parse_vector()
      if(vertex.array1.length>0){
          console.log(vectors)
          setNormalVectors({value: vectors})
          setIsFileLoaded(true)
      }

  }, [camera, movement, rotate, isDrawingStarted, scale])

  return (
    <div className="App">
        <div className={"left-part-container"}>
            <div className={"file-container"}>
                <Form>
                    <Form.Group id={"fileInputGroup"} className={"mb-3"}>
                        <Form.Label>
                            Выбрать файл
                        </Form.Label>
                        <Form.Control type={'file'} onChange={showFile}/>
                    </Form.Group>
                </Form>
            </div>
            <div>
                <Form className={"coordinate-container"}>
                    <Form.Group className={"coordinate-box"}>
                        <Form.Label>
                            X
                        </Form.Label>
                        <Form.Control type={"text"} defaultValue={camera.x} name={"x-value"} onChange={cameraOnChangeHandler}/>
                    </Form.Group>
                    <Form.Group className={"coordinate-box"}>
                        <Form.Label>
                            Y
                        </Form.Label>
                        <Form.Control type={"text"} defaultValue={camera.y} name={"y-value"} onChange={cameraOnChangeHandler}/>
                    </Form.Group>
                    <Form.Group className={"coordinate-box"}>
                        <Form.Label>
                            Z
                        </Form.Label>
                        <Form.Control type={"text"} defaultValue={camera.z} name={"z-value"} onChange={cameraOnChangeHandler}/>
                    </Form.Group>
                </Form>
                <Form className={"movement_container"}>
                    <Form.Label>
                        Перемещение
                    </Form.Label>
                    <Form.Group className={"movement_box"}>
                        <Form.Group className={"coordinate-box"}>
                            <Form.Label>X</Form.Label>
                            <Form.Control type={"text"} defaultValue={movement.x} name={"x-value-movement"} onChange={movementOnChangeHandler}/>
                        </Form.Group>
                        <Form.Group className={"coordinate-box"}>
                            <Form.Label>Y</Form.Label>
                            <Form.Control type={"text"} defaultValue={movement.y} name={"y-value-movement"} onChange={movementOnChangeHandler}/>
                        </Form.Group>
                        <Form.Group className={"coordinate-box"}>
                            <Form.Label>Z</Form.Label>
                            <Form.Control type={"text"} defaultValue={movement.z} name={"z-value-movement"} onChange={movementOnChangeHandler}/>
                        </Form.Group>
                    </Form.Group>
                </Form>
                <Form className={"rotate_container"}>
                    <Form.Label>
                        Поворот
                    </Form.Label>
                    <Form.Group className={"rotate_box"}>
                        <Form.Group className={"coordinate-box"}>
                            <Form.Label>X</Form.Label>
                            <Form.Control type={"text"} defaultValue={rotate.x} name={"x-value-rotate"}  onChange={rotateOnChangeHandler}/>
                        </Form.Group>
                        <Form.Group className={"coordinate-box"}>
                            <Form.Label>Y</Form.Label>
                            <Form.Control type={"text"} defaultValue={rotate.y} name={"y-value-rotate"} onChange={rotateOnChangeHandler}/>
                        </Form.Group>
                        <Form.Group className={"coordinate-box"}>
                            <Form.Label>Z</Form.Label>
                            <Form.Control type={"text"} defaultValue={rotate.z} name={"z-value-rotate"} onChange={rotateOnChangeHandler}/>
                        </Form.Group>
                    </Form.Group>
                </Form>
                <Form className={"scale-container"}>
                    <Form.Label>
                        Масштаб
                    </Form.Label>
                    <Form.Group className={"scale-box"}>
                        <Form.Group className={"coordinate-box"}>
                            <Form.Label>X</Form.Label>
                            <Form.Control type={"text"} defaultValue={scale.x} name={"x-value-scale"}  onChange={scaleOnChangeHandler}/>
                        </Form.Group>
                        <Form.Group className={"coordinate-box"}>
                            <Form.Label>Y</Form.Label>
                            <Form.Control type={"text"} defaultValue={scale.y} name={"y-value-scale"} onChange={scaleOnChangeHandler}/>
                        </Form.Group>
                        <Form.Group className={"coordinate-box"}>
                            <Form.Label>Z</Form.Label>
                            <Form.Control type={"text"} defaultValue={scale.z} name={"z-value-scale"} onChange={scaleOnChangeHandler}/>
                        </Form.Group>
                        <Button id={"startRenderButton"} variant={"primary"} onClick={(e)=>{
                            setIsDrawingStarted(!isDrawingStarted)
                            const button = document.getElementById("startRenderButton")
                            button.innerHTML = (!isDrawingStarted)?"Stop":"Start";
                        }}>
                            Start
                        </Button>
                    </Form.Group>
                </Form>
            </div>
        </div>
        <div className={"right-part-container"}>
            <div id={"stageContainerId"} className={"stage-container"}>
                <Stage width={700} height={600}>
                    <Layer>
                        {isFileLoaded?(
                            <Shape fill={"#FFFFFF"} stroke={"black"}  draggable={true}
                                   strokeWidth={1}
                                   sceneFunc={(ctx, shape)=>{
                                       const vectors = normalVectors.value
                                       ctx.beginPath()
                                       ctx.moveTo(vectors[0].x, vectors[0].y)
                                       const f_coordinates = vertex.array3
                                       f_coordinates.forEach(elem=>{
                                           ctx.moveTo(vectors[elem.getElem(0) - 1].x, vectors[elem.getElem(0) -1].y)
                                           for(let i = 0; i<elem.length(); i++){
                                               ctx.lineTo(vectors[elem.getElem(i) - 1].x  , vectors[elem.getElem(i) - 1].y)
                                           }
                                           ctx.lineTo(vectors[elem.getElem(0) - 1].x  , vectors[elem.getElem(0) - 1].y)
                                       })
                                       ctx.fillStrokeShape(shape)
                                   }}
                            />
                        ):(
                            <div/>
                        )}
                    </Layer>
                </Stage>
            </div>
        </div>
    </div>
  );
}

export default App;

/*
const movement_matrix = get_movement_matrix(new Vertex(movement.x,movement.y,movement.z))
      const scaleMatrix = get_scale_matrix(new Vertex(scale.x,scale.y,scale.z))
      const rotate_x = get_rotate_x_matrix(rotate.x)
      const rotate_y = get_rotate_y_matrix(rotate.y)
      const rotate_z = get_rotate_z_matrix(rotate.z)
      const translate_matrix =
          matrix_multiplication(matrix_multiplication
          (matrix_multiplication(matrix_multiplication(
              movement_matrix,scaleMatrix
          ),rotate_x), rotate_y), rotate_z)
 */