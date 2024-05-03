import React, {Suspense, useEffect, useLayoutEffect, useMemo, useRef} from "react";
import {Canvas, RootState, useFrame, useLoader} from "@react-three/fiber/native";
// @ts-ignore
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
// @ts-ignore
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader';
import {TextureLoader} from "expo-three";
import {THREE} from "expo-three";
import {useAnimatedSensor, SensorType} from 'react-native-reanimated';

const Box = (props?: any) => {
    const meshRef = useRef();

    // @ts-ignore
    const [base, normal, rough] = useLoader(TextureLoader, [
        require('./Airmax/textures/BaseColor.jpg'),
        require('./Airmax/textures/Normal.jpg'),
        require('./Airmax/textures/Roughness.png'),
    ]);

    const buffermaterial = useLoader(THREE.FileLoader, require('./Airmax/shoe.mtl'));
    const material = useMemo(() => {
        return new MTLLoader().parse(THREE.LoaderUtils.decodeText(buffermaterial));
    }, [buffermaterial]);

    const bufferObje = useLoader(THREE.FileLoader, require('./Airmax/shoe.obj'));
    const newObj = new OBJLoader();
    material.preload();
    newObj.setMaterials(material);
    const obj = useMemo(() => newObj.parse(THREE.LoaderUtils.decodeText(bufferObje)), [bufferObje]);

    useLayoutEffect(() => {
        obj.traverse((child?: any) => {
            if (child instanceof THREE.Mesh) {
                child.material.map = base;
                child.material.normalMap = normal;
                child.material.roughnessMap = rough;
            }
        });
    }, [obj]);

    useFrame((state, delta) => {
        let { x, y, z } = props.animatedSensor.sensor.value;
        x = ~~(x * 100) / 5000;
        y = ~~(y * 100) / 5000;
        // @ts-ignore
        meshRef.current.rotation.x += x;
        // @ts-ignore
        meshRef.current.rotation.y += y;
    })

  return (
      <mesh ref={meshRef} rotation={[1, 0, 0]}>
          <primitive object={obj} scale={9} />
      </mesh>
  );
}

const App = () => {

    const onCreated = (state: RootState) => {
        const _gl = state.gl.getContext()
        const pixelStorei = _gl.pixelStorei.bind(_gl)
        _gl.pixelStorei = function(...args: any) {
            const [parameter] = args;
            if (parameter === _gl.UNPACK_FLIP_Y_WEBGL) {
                return pixelStorei(...args);
            }
        }
    }

    const animatedSensor = useAnimatedSensor(SensorType.GYROSCOPE, {
        interval: 100,
    });

  return (
      <Canvas onCreated={onCreated}>
          <ambientLight intensity={4} />
          <pointLight position={[10, 10, 10]} />
          <Suspense fallback={null}>
              <Box animatedSensor={animatedSensor} />
          </Suspense>
      </Canvas>
  );
}

export default App;
