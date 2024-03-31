export async function POST(req: Request) {
  const body = await req.json();

  if (!body?.token) {
    return new Response("No token provided", {
      status: 400
    });
  } else if (typeof body.token !== "string") {
    return new Response(
      `Expected "string" token. Got "${typeof body?.token}"`,
      {
        status: 400
      }
    );
  }

  //make token programmatically generated based on time issued
  if (body.token) {
    return Response.json(true);
  }

  return new Response(`Expected "string" token. Got "${typeof body?.token}"`, {
    status: 500
  });
}
