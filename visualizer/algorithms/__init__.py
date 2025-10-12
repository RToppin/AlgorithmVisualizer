from . import bubble, insertion

REGISTRY = [
    {
        "id": bubble.ALGO_ID,
        "name": bubble.ALGO_NAME,
        "category": bubble.CATEGORY,
        "complexity": bubble.COMPLEXITY,
        "status": "ready"
    },
    {
        "id": insertion.ALGO_ID,
        "name": insertion.ALGO_NAME,
        "category": insertion.CATEGORY,
        "complexity": insertion.COMPLEXITY,
        "status": "ready"
    },
]