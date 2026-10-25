// Read-only overview of document types in the existing public Sanity dataset.
// No unpublished content or credentials exposed.
export default async () => {
 const project=Netlify.env.get("SANITY_PROJECT_ID"),dataset=Netlify.env.get("SANITY_DATASET");
 if(!project||!dataset) return Response.json({error:"Missing Sanity configuration"},{status:503});
 if(!/^[a-z0-9-]+$/.test(project)||!/^[A-Za-z0-9_-]+$/.test(dataset))return Response.json({error:"Invalid Sanity configuration"},{status:500});
 const query=encodeURIComponent('array::unique(*[!(_id in path("drafts.**"))]._type)');
 const url='https://'+project+'.api.sanity.io/v2025-02-19/data/query/'+dataset+'?query='+query;
 try{
 const res=await fetch(url,{headers:{Accept:"application/json"}});
 if(!res.ok)return Response.json({error:"Sanity query failed",status:res.status},{status:502});
 const j=await res.json();const types=(j.result||[]).filter(t=>typeof t==="string").sort();
 return Response.json({connected:true,dataset,documentTypes:types});
 }catch{return Response.json({error:"Sanity unavailable"},{status:502})}
};
export const config={path:"/api/sanity-types"};