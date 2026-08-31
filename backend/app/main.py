from fastapi import FastAPI
from app.routes.auth import router as auth_router
from app.routes.user import router as user_router
from app.routes.documents import router as documents_router
from app.routes.chat_history import router as chat_history_router
from app.routes.library import router as library_router
from app.routes.profile import router as profile_router
from app.routes.workspaces import router as workspaces_router
from app.routes.document_share import router as document_share_router
from app.routes.document_share import public_router
from fastapi.openapi.utils import get_openapi
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="PaperPilot API",
    description="AI Document Intelligence Platform",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "https://paper-pilot-delta.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(user_router)
app.include_router(documents_router)
app.include_router(chat_history_router)
app.include_router(library_router)
app.include_router(profile_router)
app.include_router(workspaces_router)
app.include_router(document_share_router)
app.include_router(public_router)
@app.get("/health")
def health_check():
    return {"status": "ok", "message": "PaperPilot backend is running"}

def custom_openapi():
    if app.openapi_schema:
        return app.openapi_schema

    openapi_schema = get_openapi(
        title="PaperPilot API",
        version="1.0.0",
        description="AI Document System",
        routes=app.routes,
    )

    # 🔥 Force Bearer auth instead of OAuth2 UI
    openapi_schema["components"]["securitySchemes"] = {
        "BearerAuth": {
            "type": "http",
            "scheme": "bearer",
            "bearerFormat": "JWT",
        }
    }

    # for path in openapi_schema["paths"]:
    #     for method in openapi_schema["paths"][path]:
    #         openapi_schema["paths"][path][method]["security"] = [
    #             {"BearerAuth": []}
    #         ]
    for path in openapi_schema["paths"]:
        for method in openapi_schema["paths"][path]:

            # Public shared-document endpoints don't require JWT
            if path.startswith("/shared/"):
                continue

            openapi_schema["paths"][path][method]["security"] = [
                {"BearerAuth": []}
            ]

    app.openapi_schema = openapi_schema
    return app.openapi_schema


app.openapi = custom_openapi