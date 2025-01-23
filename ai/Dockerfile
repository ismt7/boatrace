FROM python:3.8

WORKDIR /usr/src/app

COPY requirements.txt ./
RUN pip install -r requirements.txt

COPY . .

CMD ["bash", "-c", "FLASK_ENV=development flask run --host=0.0.0.0 --port=3010"]
