export default async () => {
 const project=Netlify.env.get("SANITY_PROJECT_ID"),dataset=Netlify.env.get("SANITY_DATASET");
 if(!project||!dataset||!/^[a-z0-9-]+$/.test(project)||!/^[A-Za-z0-9_-]+$/.test(dataset))return Response.json({error:"Missing Sanity configuration"},{status:503});
 const query='*[_type == "story" && !(_id in path("drafts.**"))] | order(date desc) { _id,title,dek,date,kind,heroUrl,url,"slug":slug.current,"editionTitle":edition->title }';
 try {const upstream=await fetch('https://'+project+'.api.sanity.io/v2025-02-19/data/query/'+dataset+'?query='+encodeURIComponent(query));
 if(!upstream.ok)return Response.json({error:"Sanity query failed",status:upstream.status},{status:502});
 const json=await upstream.json();return Response.json({stories:json.result??[]},{headers:{"Cache-Control":"public,max-age=60,stale-while-revalidate=300"}});
 }catch{return Response.json({error:"Sanity API unavailable"},{status:502})}
};
export const config={path:"/api/stories"};