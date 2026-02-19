FROM python:3.11-alpine as builder
RUN apk --update add bash nano g++
COPY ./requirements.txt /vampi/requirements.txt
WORKDIR /vampi
RUN pip install -r requirements.txt

# Build a fresh container, copying across files & compiled parts
FROM python:3.11-alpine
RUN apk --no-cache add curl
COPY . /vampi
WORKDIR /vampi
COPY --from=builder /usr/local/lib /usr/local/lib
COPY --from=builder /usr/local/bin /usr/local/bin
ENV vulnerable=1
ENV tokentimetolive=600

CMD ["sh", "-c", "python app.py & sleep 2 && curl -f http://127.0.0.1:5000/createdb && wait"]
