from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes_chat import router as chat_router
from starlette.responses import Response
import json

# -----------------------------------------------------
# Configuration
# -----------------------------------------------------
DEBUG_MODE = False  # Toggle this flag to enable/disable debug logging

app = FastAPI(title="DevOpsCool", debug=DEBUG_MODE)

origins = [
    "http://localhost:5173",
    "https://devopscool",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -----------------------------------------------------
# Conditional Debug Middleware
# -----------------------------------------------------
if DEBUG_MODE:
    @app.middleware("http")
    async def log_requests(request: Request, call_next):
        try:
            body = await request.body()
            print(f"\n[DEBUG] {request.method} {request.url.path}")
            if body:
                try:
                    parsed = json.loads(body)
                    print("[DEBUG] Request JSON:", json.dumps(parsed, indent=2))
                except json.JSONDecodeError:
                    print("[DEBUG] Raw Request Body:", body.decode("utf-8"))
        except Exception as e:
            print(f"[DEBUG] Could not read request body: {e}")

        # Process request and capture response
        response = await call_next(request)

        # Clone response body (so we can log it safely)
        try:
            response_body = b""
            async for chunk in response.body_iterator:
                response_body += chunk
            # Recreate response with the same content
            response = Response(
                content=response_body,
                status_code=response.status_code,
                headers=dict(response.headers),
                media_type=response.media_type,
            )

            # Try to parse JSON for cleaner logging
            try:
                parsed_resp = json.loads(response_body)
                print("[DEBUG] Response JSON:", json.dumps(parsed_resp, indent=2))
            except json.JSONDecodeError:
                print("[DEBUG] Raw Response Body:", response_body.decode("utf-8"))

        except Exception as e:
            print(f"[DEBUG] Could not read response body: {e}")

        print(f"[DEBUG] Response status: {response.status_code}")
        return response

# -----------------------------------------------------
# Routes
# -----------------------------------------------------
app.include_router(chat_router)

@app.get("/")
def root():
    return {"message": "DevOpsCool backend is running"}


# -----------------------------------------------------
# Entry point
# -----------------------------------------------------
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8080,
        reload=True,
        log_level="debug" if DEBUG_MODE else "info",
    )
