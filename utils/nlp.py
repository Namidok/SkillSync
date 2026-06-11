from typing import List
import re

SKILL_PATTERNS = [
    "python", "sql", "java", "scala", "r", "bash", "javascript", "typescript",
    "pytorch", "tensorflow", "keras", "scikit-learn", "sklearn", "xgboost",
    "lightgbm", "huggingface", "transformers",
    "pandas", "numpy", "spark", "pyspark", "airflow", "dbt", "kafka", "flink",
    "luigi", "prefect",
    "langchain", "openai", "llm", "rag", "vector search", "embeddings",
    "chromadb", "faiss", "pinecone", "llamaindex",
    "aws", "gcp", "azure", "ec2", "s3", "lambda", "ecs", "fargate", "sagemaker",
    "bigquery", "dataflow",
    "postgresql", "mysql", "mongodb", "redis", "elasticsearch", "snowflake",
    "databricks", "redshift",
    "docker", "kubernetes", "terraform", "ci/cd", "github actions", "jenkins",
    "fastapi", "flask", "django", "nginx", "streamlit",
    "agile", "scrum", "mlops", "data modeling", "etl", "rest api", "graphql",
]


def extract_skills(text: str) -> List[str]:
    """
    Extract skills from raw job description text.
    Returns a sorted, deduplicated list of matched skills.
    """
    if not text:
        return []

    text_lower = text.lower()
    found = set()

    for skill in SKILL_PATTERNS:
        pattern = r'\b' + re.escape(skill) + r'\b'
        if re.search(pattern, text_lower):
            found.add(skill)

    return sorted(found)


def skill_gap_analysis(your_skills: List[str], required_skills: List[str]) -> dict:
    """
    Compare your skills against required JD skills.
    Returns matched, missing, and a coverage percentage.
    """
    your_set = set(s.lower() for s in your_skills)
    required_set = set(s.lower() for s in required_skills)

    matched = sorted(your_set & required_set)
    missing = sorted(required_set - your_set)
    coverage = round(len(matched) / len(required_set) * 100, 1) if required_set else 100.0

    return {
        "matched": matched,
        "missing": missing,
        "coverage_pct": coverage,
    }


YOUR_SKILLS = [
    "python", "sql", "pandas", "numpy", "pytorch", "keras", "tensorflow",
    "fastapi", "langchain", "chromadb", "docker", "aws", "s3",
    "ec2", "github actions", "streamlit", "rag", "embeddings",
]