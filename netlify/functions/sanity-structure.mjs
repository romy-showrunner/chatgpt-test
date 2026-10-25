// Read-only public schema reconnaissance for SHOWRUNNER. No draft data or tokens.
// Returns document type counts and observed field names only, not editorial content.
export default async () => {
 const project=Netlify.env.get("SANITY_PROJECT_ID"),dataset=Netlify.env.get("SANITY_DATASET");
 if(!project||!dataset||!/^[a-z0-9-]+$/.test(project)||!/^[A-Za-z0-9_-]+$/.test(dataset))return Response.json({error:"Sanity configuration unavailable"},{status:503});
 const types=["story","person","edition","liveUpdate","session","stage","team","series","standing"];
 const query='{'+types.map((type)=>'"'+type+'": {"count": count(*[_type=="'+type+'" && !(_id in path("drafts.**"))]), "fields": array::unique(*[_type=="'+type+'" && !(_id in path("drafts.**"))][0...30]{ "keys": array::join(array::unique(string::split(string(_id), "/")), ",") })}').join(',')+'}';
 // GROQ can be more reliably evaluated as one per type below.
 const results={}; const base='https://'+project+'.api.sanity.io/v2025-02-19/data/query/'+dataset;
 try{
   for(const type of types){
     const q=encodeURIComponent('{"count":count(*[_type=="'+type+'" && !(_id in path("drafts.**"))]),"samples":*[_type=="'+type+'" && !(_id in path("drafts.**"))][0...4]}');
     const res=await fetch(base+'?query='+q);
     if(!res.ok){results[type]={error:res.status};continue}
     const data=(await res.json()).result;
     const fields=[...new Set((data.samples||[]).flatMap(v=>Object.keys(v)))].filter(k=>!k.startsWith("_")).sort();
     results[type]={count:data.count,fields};
   }
   return Response.json({connected:true,dataset,types:results});
 }catch(e){return Response.json({error:"Sanity query unavailable"},{status:502})}
};
export const config={path:"/api/sanity-structure"};