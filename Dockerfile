FROM tiangolo/meinheld-gunicorn:latest as base-image

COPY ./requirements.txt /app/requirements.txt
RUN pip install -r requirements.txt
RUN rm -rf /app
ADD . /app/
WORKDIR /app
ENV APP_MODULE=src.app:app
ENV PORT=8080