"""Router de chat — endpoint de chat culinário com IA."""
from fastapi import APIRouter, HTTPException, status

from app.api.dependencies.deps import get_ai_service
from app.api.schemas.schemas import ChatRequest, ChatResponse
from app.application.use_cases.ai_use_cases import ChatCopilotUseCase

router = APIRouter(prefix="/api/chat", tags=["chat"])


@router.post("/copilot", response_model=ChatResponse)
async def chat_copilot(
    request: ChatRequest,
):
    """Chat culinário assistido por IA."""
    if not request.message or not request.message.strip():
        raise HTTPException(status_code=400, detail="Mensagem não pode ser vazia")

    ai_service = get_ai_service()
    use_case = ChatCopilotUseCase(ai_service=ai_service)

    try:
        result = await use_case.execute(
            message=request.message,
            context=request.context,
        )
        return ChatResponse(**result)
    except ValueError:
        raise HTTPException(status_code=502, detail="IA retornou formato inválido")
    except TimeoutError:
        raise HTTPException(status_code=504, detail="IA não respondeu a tempo")
