from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from endpoints.test_endpoint import router as test_router
from endpoints.voice_endpoint import sio_app

app = FastAPI(title="ElderSphere API")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(test_router, prefix="/api", tags=["test"])

@app.get("/")
async def root():
    return {"message": "ElderSphere API is running"}

@app.get("/health")
async def health():
    return {"status": "healthy", "voice_service": "ready"}

# Mount Socket.IO app for voice communication
app.mount("/", sio_app)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
