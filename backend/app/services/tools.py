from typing import Type, Any, Optional
from langchain_core.tools import BaseTool
from pydantic import BaseModel, Field
import numexpr
import datetime
from langchain_community.tools.ddg_search import DuckDuckGoSearchRun

class CalculatorInput(BaseModel):
    expression: str = Field(description="The mathematical expression to evaluate (e.g. '2 + 2 * 3')")

class CalculatorTool(BaseTool):
    name: str = "calculator"
    description: str = "Useful for when you need to answer questions about math."
    args_schema: Type[BaseModel] = CalculatorInput

    def _run(self, expression: str, run_manager: Optional[Any] = None) -> str:
        try:
            return str(numexpr.evaluate(expression))
        except Exception as e:
            return f"Error: {str(e)}"

class CurrentTimeTool(BaseTool):
    name: str = "current_time"
    description: str = "Useful for when you need to know the current date and time."

    def _run(self, run_manager: Optional[Any] = None) -> str:
        return datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")

# Web Search
def get_web_search_tool():
    return DuckDuckGoSearchRun(name="web_search", description="Search the web for current events, news, or general information not in your knowledge base.")

# Knowledge Base Search
class KBSearchInput(BaseModel):
    query: str = Field(description="The query to search in the knowledge base documents.")

class KnowledgeBaseSearchTool(BaseTool):
    name: str = "knowledge_base_search"
    description: str = "Search the uploaded documents in the knowledge base for specific context."
    args_schema: Type[BaseModel] = KBSearchInput
    
    # We pass the async fetch function to this tool
    fetch_func: Any = None
    
    def __init__(self, fetch_func: Any, **kwargs):
        super().__init__(**kwargs)
        self.fetch_func = fetch_func

    def _run(self, query: str, run_manager: Optional[Any] = None) -> str:
        raise NotImplementedError("This tool requires async execution.")
        
    async def _arun(self, query: str, run_manager: Optional[Any] = None) -> str:
        # fetch_func will be bound to the specific db session
        context, sources = await self.fetch_func(query)
        if not context:
            return "No relevant documents found in the knowledge base."
        return context
