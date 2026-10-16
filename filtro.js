// Filtro Halloween local: caricatura con MediaPipe + canvas
const MP='https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14',MODEL='https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task';
let LM=null,LMp=null;
function loadLM(){return LMp||(LMp=(async()=>{try{const m=await import(MP+'/vision_bundle.mjs');const fs=await m.FilesetResolver.forVisionTasks(MP+'/wasm');LM=await m.FaceLandmarker.createFromOptions(fs,{baseOptions:{modelAssetPath:MODEL},runningMode:'IMAGE',numFaces:3})}catch(e){console.warn('FaceLandmarker no disponible',e);LM=null}return LM})())}
const av=(f,...i)=>({x:i.reduce((s,k)=>s+f[k].x,0)/i.length,y:i.reduce((s,k)=>s+f[k].y,0)/i.length});
function feat(f){const g={A:av(f,33,133,159,145),B:av(f,263,362,386,374),M:av(f,61,291,13,14),nose:f[1],fo:f[10],ch:f[152],c1:f[61],c2:f[291],up:f[13],fl:f[234],fr:f[454]};
  g.ed=Math.hypot(g.B.x-g.A.x,g.B.y-g.A.y);g.mw=Math.hypot(g.c2.x-g.c1.x,g.c2.y-g.c1.y);g.fw=Math.abs(g.fr.x-g.fl.x);g.fh=Math.abs(g.ch.y-g.fo.y);return g}
function bulge(p,N,cx,cy,r,k){
  const s=p.slice(),x0=Math.max(0,Math.floor(cx-r)),x1=Math.min(N-1,Math.ceil(cx+r)),y0=Math.max(0,Math.floor(cy-r)),y1=Math.min(N-1,Math.ceil(cy+r));
  for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++){
    const dx=x-cx,dy=y-cy,d=Math.hypot(dx,dy)/r;if(d>=1)continue;
    const f=1-k*(1-d*d),sx=Math.round(cx+dx*f),sy=Math.round(cy+dy*f),o=(y*N+x)*4,q=(sy*N+sx)*4;
    p[o]=s[q];p[o+1]=s[q+1];p[o+2]=s[q+2];
  }
}
function bat(x,cx,cy,s){x.save();x.translate(cx,cy);x.scale(s,s);x.beginPath();x.moveTo(0,0);x.quadraticCurveTo(-20,-30,-60,-20);x.quadraticCurveTo(-45,-5,-40,10);x.quadraticCurveTo(-25,0,-15,15);x.quadraticCurveTo(-8,5,0,12);x.quadraticCurveTo(8,5,15,15);x.quadraticCurveTo(25,0,40,10);x.quadraticCurveTo(45,-5,60,-20);x.quadraticCurveTo(20,-30,0,0);x.fill();x.restore()}
function web(x,cx,cy,dx,dy,R){
  const pts=k=>Array.from({length:5},(_,i)=>{const a=i/4*Math.PI/2;return[cx+dx*Math.cos(a)*R*k,cy+dy*Math.sin(a)*R*k]});
  x.beginPath();pts(1).forEach(q=>{x.moveTo(cx,cy);x.lineTo(q[0],q[1])});
  for(let k=1;k<=4;k++){const q=pts(k/4);x.moveTo(q[0][0],q[0][1]);for(let i=1;i<5;i++){const mx=(q[i-1][0]+q[i][0])/2,my=(q[i-1][1]+q[i][1])/2;x.quadraticCurveTo(cx+(mx-cx)*.86,cy+(my-cy)*.86,q[i][0],q[i][1])}}
  x.stroke();
}
function accesorios(x,g,L){
  const ink='#12081f';x.lineCap='round';
  // ojos rojos brillantes
  if(L.eyes)[g.A,g.B].forEach(e=>{const r=g.ed*.2,gr=x.createRadialGradient(e.x,e.y,0,e.x,e.y,r);gr.addColorStop(0,'rgba(255,40,40,.75)');gr.addColorStop(1,'rgba(255,40,40,0)');x.fillStyle=gr;x.beginPath();x.arc(e.x,e.y,r,0,7);x.fill()});
  if(L.hat){
  const cx=(g.fl.x+g.fr.x)/2,w=g.fw*1.5,by=g.fo.y-g.fh*.03,h=g.fh*1.1;
  x.fillStyle=ink;x.strokeStyle='#ff7a1a';x.lineWidth=Math.max(4,g.fw*.02);
  x.beginPath();x.moveTo(cx-w*.3,by);x.quadraticCurveTo(cx-w*.05,by-h*.55,cx+w*.12,by-h);x.quadraticCurveTo(cx+w*.1,by-h*.5,cx+w*.3,by);x.closePath();x.fill();x.stroke();
  x.beginPath();x.ellipse(cx,by,w/2,w*.07,0,0,7);x.fill();x.stroke();
  x.fillStyle='#ff7a1a';x.beginPath();x.ellipse(cx,by-h*.04,w*.3,w*.035,0,0,7);x.fill();
  }
  if(L.scar){
  const u=g.ed,a={x:g.A.x+u*.28,y:g.A.y-u*.85},b={x:g.A.x-u*.22,y:g.A.y+u*.9};
  x.lineCap='round';x.strokeStyle='#8c0a14';x.lineWidth=u*.07;x.beginPath();x.moveTo(a.x,a.y);x.lineTo(b.x,b.y);x.stroke();
  x.strokeStyle='#ffe9b0';x.lineWidth=u*.03;
  for(let t=.15;t<=.85;t+=.14){const px=a.x+(b.x-a.x)*t,py=a.y+(b.y-a.y)*t;x.beginPath();x.moveTo(px-u*.1,py-u*.03);x.lineTo(px+u*.1,py+u*.03);x.stroke()}
  }
  if(L.fangs){
  x.fillStyle='#fff4d6';x.strokeStyle=ink;x.lineWidth=Math.max(2,g.mw*.02);
  [-1,1].forEach(s=>{const fx=g.M.x+s*g.mw*.2,fy=g.up.y+g.mw*.02;x.beginPath();x.moveTo(fx-g.mw*.05,fy);x.lineTo(fx+g.mw*.05,fy);x.lineTo(fx,fy+g.mw*.2);x.closePath();x.fill();x.stroke()});
  }
  if(L.blood){
  x.fillStyle='#d00000';x.strokeStyle='#d00000';x.lineWidth=g.mw*.07;
  const cx2=g.c2.x,cy2=g.c2.y;x.beginPath();x.moveTo(cx2,cy2);x.lineTo(cx2+g.mw*.02,cy2+g.mw*.55);x.stroke();x.beginPath();x.arc(cx2+g.mw*.02,cy2+g.mw*.58,g.mw*.07,0,7);x.fill();
  x.lineWidth=g.mw*.05;x.beginPath();x.moveTo(cx2-g.mw*.12,cy2+g.mw*.06);x.lineTo(cx2-g.mw*.12,cy2+g.mw*.28);x.stroke();
  }
}
const LOOKS=[{n:'bruja',hat:1,eyes:1},{n:'vampiro',fangs:1,blood:1},{n:'zombi',scar:1,eyes:1},{n:'caricatura',caric:1,fangs:1}];
let lastLook=-1;
function pickLook(){let i;do{i=Math.floor(Math.random()*LOOKS.length)}while(i===lastLook);lastLook=i;return LOOKS[i]}
async function halloween(img){
  const N=720,c=document.createElement('canvas');c.width=c.height=N;const x=c.getContext('2d');
  const s=Math.min(img.width,img.height);
  x.drawImage(img,(img.width-s)/2,(img.height-s)/2,s,s,0,0,N,N);
  let faces=[];const lm=await loadLM();
  if(lm){try{faces=lm.detect(c).faceLandmarks.map(f=>feat(f.map(q=>({x:q.x*N,y:q.y*N}))))}catch(e){}}
  const d=x.getImageData(0,0,N,N),p=d.data;
  const L=pickLook();
  if(L.caric)faces.forEach(g=>{bulge(p,N,g.A.x,g.A.y,g.ed*.4,.32);bulge(p,N,g.B.x,g.B.y,g.ed*.4,.32);bulge(p,N,g.M.x,g.M.y,g.mw*.7,.15)});
  let sum=0;for(let i=0;i<p.length;i+=4)sum+=.299*p[i]+.587*p[i+1]+.114*p[i+2];
  const avg=sum/(p.length/4)/255,gain=Math.min(3,Math.max(.8,.45/Math.max(avg,.05)));
  const pal=[[18,8,31],[88,28,140],[255,122,26],[255,201,51],[255,244,214]],n=pal.length;
  for(let i=0;i<p.length;i+=4){
    let l=Math.min(1,(.299*p[i]+.587*p[i+1]+.114*p[i+2])/255*gain);l=l*l*(3-2*l);
    const t=l*(n-1),b=Math.min(n-2,Math.floor(t)),f=Math.min(1,Math.max(0,(t-b-.35)/.3)),A=pal[b],B=pal[b+1];
    p[i]=A[0]+(B[0]-A[0])*f;p[i+1]=A[1]+(B[1]-A[1])*f;p[i+2]=A[2]+(B[2]-A[2])*f;
  }
  x.putImageData(d,0,0);
  const g=x.createRadialGradient(N/2,N/2,N*.35,N/2,N/2,N*.74);g.addColorStop(0,'rgba(10,0,20,0)');g.addColorStop(1,'rgba(10,0,20,.7)');
  x.fillStyle=g;x.fillRect(0,0,N,N);
  x.save();x.shadowColor='#ffc933';x.shadowBlur=40;x.fillStyle='#fff4d6';x.beginPath();x.arc(630,100,55,0,7);x.fill();x.restore();
  x.fillStyle='#12081f';bat(x,500,80,.9);bat(x,575,210,.6);bat(x,110,190,.7);
  x.strokeStyle='rgba(255,244,214,.55)';x.lineWidth=2;web(x,0,0,1,1,230);web(x,N,0,-1,1,200);
  faces.forEach(f=>accesorios(x,f,L));
  x.textBaseline='top';[['👻',570,500,130],['🎃',20,490,150]].forEach(([e,a,b,z])=>{x.font=z+'px serif';x.fillText(e,a,b)});
  x.textAlign='center';x.font='46px "Bowlby One",Impact,sans-serif';x.lineWidth=8;x.strokeStyle='#12081f';x.strokeText('Feliz Halloween',N/2,640);x.fillStyle='#f3ead7';x.fillText('Feliz Halloween',N/2,640);
  return c;
}
