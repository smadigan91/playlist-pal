FROM python:3.10.6

COPY .. /playlist-pal
WORKDIR /playlist-pal
RUN pip install -r requirements.txt

WORKDIR /playlist-pal/tests
RUN pip install -r test-requirements.txt

ENV PYTHONPATH="${PYTHONPATH}:/playlist-pal"

CMD pytest -vv --timeout=30