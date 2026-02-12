FROM python:3.10-slim

WORKDIR /app/ai-engine

COPY requirements.txt ./

RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["python", "-m" , "uvicorn", "app:app", "--host", "--port", "8000"]

