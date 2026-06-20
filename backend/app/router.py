from complexity import classify_prompt

def choose_provider(prompt: str):

    complexity = classify_prompt(prompt)

    print(f"Prompt classified as: {complexity}")

    if complexity == "simple":
        return "groq"

    return "gemini"