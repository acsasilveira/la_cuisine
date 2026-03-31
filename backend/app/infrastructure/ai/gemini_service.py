"""Serviço de IA usando Google Gemini API."""
import json

from app.domain.ports.service_ports import AIServicePort

RECIPE_EXTRACTION_PROMPT = """You are an expert culinary assistant. Extract recipe information from the provided image and return ONLY a valid JSON object matching this schema:
{
  "title": string,
  "category": string (appetizer, main, dessert, other),
  "yield_amount": number,
  "yield_unit": string,
  "ingredients": [{"name": string, "amount": number, "unit": string}],
  "steps": [string]
}
Do not include markdown formatting or explanations."""

MENU_SUGGESTION_PROMPT = """You are a professional chef specializing in menu design and flavor pairing.
Plan a 3-course menu. Prioritize recipes from the provided list (mark as is_new: false).
If no suitable recipe exists, suggest new ones (mark as is_new: true).
Return ONLY valid JSON matching this schema:
{
  "menus": [
    {
      "entrada": {"name": string, "is_new": boolean},
      "principal": {"name": string, "is_new": boolean},
      "sobremesa": {"name": string, "is_new": boolean},
      "justificativa": string
    }
  ]
}"""

CHAT_COPILOT_PROMPT = """You are a professional culinary assistant (copilot).
Respond to the user's culinary question.
Return ONLY valid JSON matching one of these schemas:

For text responses: {"type": "text", "data": {"message": string}}
For recipe suggestions: {"type": "recipe", "data": {"title": string, "category": string, "yield_amount": number, "yield_unit": string, "ingredients": [...], "steps": [...]}}
For menu suggestions: {"type": "menu", "data": {"menus": [...]}}
"""

REQUIRED_RECIPE_FIELDS = {"title", "category", "yield_amount", "yield_unit", "ingredients", "steps"}


class GeminiAIService(AIServicePort):
    """Implementação do serviço de IA usando Google Gemini."""

    def __init__(self, api_key: str):
        self.api_key = api_key

    async def _call_gemini(self, prompt: str, image_bytes: bytes | None = None) -> dict:
        """Chama a API do Gemini. Método separado para facilitar mocking nos testes."""
        from google import genai

        client = genai.Client(api_key=self.api_key)

        contents = []
        if image_bytes:
            contents.append({"inline_data": {"mime_type": "image/jpeg", "data": image_bytes}})
        contents.append(prompt)

        response = client.models.generate_content(
            model="gemini-2.0-flash",
            contents=contents,
        )

        # Extrair JSON da resposta
        text = response.text.strip()
        if text.startswith("```"):
            text = text.split("\n", 1)[1].rsplit("```", 1)[0].strip()

        return json.loads(text)

    async def analyze_image(self, image_bytes: bytes) -> dict:
        """Analisa uma imagem e extrai dados de receita."""
        result = await self._call_gemini(RECIPE_EXTRACTION_PROMPT, image_bytes)

        # Validar campos obrigatórios
        missing = REQUIRED_RECIPE_FIELDS - set(result.keys())
        if missing:
            raise ValueError(f"Resposta da IA em formato inválido. Campos faltando: {missing}")

        return result

    async def suggest_menu(self, base_recipe: dict, available_recipes: list[dict]) -> dict:
        """Sugere menus baseados em receitas disponíveis."""
        context = f"Receita base: {json.dumps(base_recipe, ensure_ascii=False)}\n"
        context += f"Receitas disponíveis: {json.dumps(available_recipes, ensure_ascii=False)}"
        prompt = f"{MENU_SUGGESTION_PROMPT}\n\n{context}"

        return await self._call_gemini(prompt)

    async def chat(self, message: str, context: dict | None = None) -> dict:
        """Processa mensagem de chat culinário."""
        prompt = CHAT_COPILOT_PROMPT
        if context:
            prompt += f"\n\nContexto: {json.dumps(context, ensure_ascii=False)}"
        prompt += f"\n\nMensagem do usuário: {message}"

        return await self._call_gemini(prompt)
