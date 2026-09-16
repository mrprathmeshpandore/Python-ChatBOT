import re
from typing import List

class Message:
    def __init__(self, role, content):
        self.role = role
        self.content = content

def is_python_related(query: str, chat_history: List[Message] = None) -> bool:
    if not query or not query.strip():
        return False
        
    q_lower = query.lower().strip()
    
    # 1. Allow Greetings
    greetings = ["hi", "hello", "hey", "namaste", "नमस्कार", "नमस्ते", "good morning", "good evening", "namaskar"]
    if q_lower in greetings or any(q_lower.startswith(g + " ") for g in greetings) or q_lower == "hi there":
        return True
        
    # 2. Key Python topics, libraries, frameworks, concepts, and keywords
    python_patterns = [
        r"\bpython\b", r"\bpython3\b", r"\bpip\b", r"\bvenv\b", r"\bvirtualenv\b", r"\bconda\b", r"\bpep8\b", r"\bpytest\b", r"\bunittest\b",
        r"\bfastapi\b", r"\bflask\b", r"\bdjango\b", r"\bnumpy\b", r"\bpandas\b", r"\bsqlalchemy\b", r"\bscipy\b", r"\bmatplotlib\b",
        r"\blangchain\b", r"\blanggraph\b", r"\brag\b", r"\bgemini\b", r"\bllm\b", r"\bai\b", r"\bmachine learning\b"
    ]
    
    for pattern in python_patterns:
        if re.search(pattern, q_lower):
            return True

    # 3. Check for general coding/programming questions
    general_coding_patterns = [
        r"\bcode\b", r"\bcoding\b", r"\bprogram\b", r"\bprogramming\b", r"\bdeveloper\b", r"\bdevelopment\b",
        r"\bapi\b", r"\bapis\b", r"\bjson\b", r"\brest\b", r"\balgorithm\b", r"\bdata structure\b", r"\brecursions?\b",
    ]
    
    for gpattern in general_coding_patterns:
        if re.search(gpattern, q_lower):
            return True

    # 4. Check if it's a follow-up and the previous conversation was Python-related
    prev_context = ""
    if chat_history and len(chat_history) >= 2:
        # Exclude the very last message which is the current query
        msgs = chat_history[:-1]
        if msgs:
            for m in msgs[-4:]:
                prev_context += m.content.lower() + " "
                
    is_prev_python_related = False
    if prev_context:
        for pattern in python_patterns + general_coding_patterns:
            if re.search(pattern, prev_context):
                is_prev_python_related = True
                break
                
    if is_prev_python_related:
        follow_ups = [
            "explain", "why", "it", "this", "that", "again", "summarize", "example", 
            "advantages", "disadvantages", "what", "how", "short", "brief", "difference", 
            "yes", "no", "thanks", "thank you", "ok", "okay", "meaning", "give", "lines",
            "समजाव", "मराठीत", "सांग"
        ]
        if any(word in q_lower.split() for word in follow_ups) or len(q_lower.split()) <= 15:
            return True

    # 5. Non-Python programming languages / tech stacks to block
    blocked_tech = [
        r"\bjavascript\b", r"\bjava\b", r"\bc\+\+\b", r"\bphp\b"
    ]
    
    for btech in blocked_tech:
        if re.search(btech, q_lower):
            return False

    return False

# Test Cases
chat_history = [
    Message("user", "What is FastAPI?"),
    Message("assistant", "FastAPI is a Python framework..."),
    Message("user", "Explain it in 2-3 lines.") # Current message, won't be in prev_context! Wait, yes it will be at the end.
]

tests = [
    ("Hi", chat_history),
    ("Hello", chat_history),
    ("नमस्कार", chat_history),
    ("What is FastAPI?", chat_history),
    ("Explain it in 2-3 lines.", chat_history),
    ("Explain again.", chat_history),
    ("Summarize.", chat_history),
    ("Give an example.", chat_history),
    ("हे मराठीत समजाव.", chat_history),
    ("How to cook pasta?", chat_history) # Should be false
]

for query, hist in tests:
    hist_copy = hist[:-1] + [Message("user", query)]
    print(f"'{query}' -> {is_python_related(query, hist_copy)}")
