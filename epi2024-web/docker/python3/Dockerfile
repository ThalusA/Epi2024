FROM python:3.7-slim

WORKDIR /app

COPY . /app

RUN pip install --trusted-host pypi.python.org -r requirements.txt

EXPOSE 80

ENV Name Python

CMD ["python", "app.py"]