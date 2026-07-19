const http = require('http');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const root = path.join(__dirname, 'dist');
const mime = {'.html':'text/html; charset=utf-8','.js':'application/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.svg':'image/svg+xml','.ico':'image/x-icon'};
function start(port){
 const server=http.createServer((req,res)=>{
  let pathname=decodeURIComponent((req.url||'/').split('?')[0]);
  let target=path.join(root, pathname==='/'?'index.html':pathname);
  if(!target.startsWith(root)){res.writeHead(403);return res.end('Forbidden');}
  fs.stat(target,(err,stat)=>{
   if(err||!stat.isFile()) target=path.join(root,'index.html');
   fs.readFile(target,(readErr,data)=>{
    if(readErr){res.writeHead(500);return res.end('Unable to load BEP');}
    res.writeHead(200,{'Content-Type':mime[path.extname(target).toLowerCase()]||'application/octet-stream','Cache-Control':'no-cache'});res.end(data);
   });
  });
 });
 server.on('error',e=>{if(e.code==='EADDRINUSE'&&port<5200)return start(port+1);console.error(e);process.exit(1);});
 server.listen(port,'127.0.0.1',()=>{const url=`http://127.0.0.1:${port}/dashboard`;console.log(`Basithami Enterprise Operating System Build 011 is running at ${url}`);setTimeout(()=>exec(`start "" "${url}"`),500);});
}
start(5173);
