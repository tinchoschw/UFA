// Detector de caras (MediaPipe) para validar que la foto tenga al menos una cara
const MP='https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14',MODEL='https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task';
let LM=null,LMp=null;
function loadLM(){return LMp||(LMp=(async()=>{try{const m=await import(MP+'/vision_bundle.mjs');const fs=await m.FilesetResolver.forVisionTasks(MP+'/wasm');LM=await m.FaceLandmarker.createFromOptions(fs,{baseOptions:{modelAssetPath:MODEL},runningMode:'IMAGE',numFaces:3})}catch(e){console.warn('FaceLandmarker no disponible',e);LM=null}return LM})())}
