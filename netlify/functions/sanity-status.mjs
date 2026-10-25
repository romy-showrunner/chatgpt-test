// SHOWRUNNER staging: read-only Sanity connectivity test.
// No API tokens in the client bundle or public repository.
export default async (request) => {
  const projectId = Netlify.env.get("SANITY_PROJECT_ID");
  const dataset = Netlify.env.get("SANITY_DATASET");
  if (!projectId || !dataset) {
    return Response.json({connected:false,reason:"Sanity project details not configured",required:["SANITY_PROJECT_ID","SANITY_DATASET"]},{status:503});
  }
  if (!/^[a-z0-9-]+$/.test(projectId) || !/^[a-zA-Z0-9_-]+$/.test(dataset)) {
    return Response.json({connected:false,reason:"Invalid project configuration"},{status:500});
  }
  // Only count published documents. This endpoint cannot create, edit, or publish.
  const query = encodeURIComponent('count(*[!(_id in path("drafts.**"))])');
  const endpoint = 'https://'+projectId+'.api.sanity.io/v2026-10-01/data/query/'+dataset+'?query='+query;
  try {
    const upstream = await fetch(endpoint,{headers:{"Accept":"application/json"}});
    if (!upstream.ok) return Response.json({connected:false,reason:"Sanity query failed",status:upstream.status},{status:502});
    const data = await upstream.json();
    return Response.json({connected:true,dataset,publicPublishedDocumentCount:data.result??null});
  } catch {
    return Response.json({connected:false,reason:"Sanity API unreachable"},{status:502});
  }
};
export const config={path:"/api/sanity-status"};
