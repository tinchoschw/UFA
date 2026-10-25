import {initializeApp} from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js';
import {getAuth} from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js';
import {getFirestore,doc,onSnapshot} from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js';
import {FB_CONFIG} from './config.js';
export * from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js';
export * from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js';
export const app=initializeApp(FB_CONFIG),auth=getAuth(app),db=getFirestore(app);
export const R=[['fuego','🔥'],['amor','❤️'],['birra','🍺'],['baile','💃'],['fiesta','🎉'],['diablo','😈']];
export const DEF={enabled:true,photosPaused:false,cooldownSecs:60,sendsNight:10,photosNight:2,photoSecs:8,maxEmojis:40,maxPhotos:3,maxQueue:8,bg:'',titulo:'Escaneá y reaccioná 🔥'};
export const refs={cfg:doc(db,'cfg','rx'),token:doc(db,'screen','token'),tv:doc(db,'screen','tv')};
export const watchCfg=cb=>onSnapshot(refs.cfg,s=>cb({...DEF,...(s.exists()?s.data():{})}));
// "noche" = día corrido 8 h, así las 3 AM cuentan para la noche anterior
export const night=()=>{const d=new Date(Date.now()-8*36e5),p=n=>String(n).padStart(2,'0');return d.getFullYear()+'-'+p(d.getMonth()+1)+'-'+p(d.getDate())};
