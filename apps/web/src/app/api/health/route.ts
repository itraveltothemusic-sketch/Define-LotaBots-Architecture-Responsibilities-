export async function GET() {
  return Response.json({
    ok: true,
    service: "equity-builders-web",
    time: new Date().toISOString(),
  });
}

