FROM python:3.10.6-slim-buster

## Add Python script, requirements file and templates folder to /app 
## directory on the image:

WORKDIR /app
COPY requirements.txt requirements.txt
COPY flask_api.py flask_api.py
COPY model.py model.py


# things to make ms sql work
RUN apt-get update \
  && apt-get -y install ca-certificates \
  && apt-get -y install curl

RUN apt-get update \
  && apt-get -y install gcc gnupg2 \
  && curl https://packages.microsoft.com/keys/microsoft.asc | apt-key add - \
  && curl https://packages.microsoft.com/config/debian/10/prod.list > /etc/apt/sources.list.d/mssql-release.list


RUN apt-get update \
  && ACCEPT_EULA=Y apt-get -y install msodbcsql17 \
  && ACCEPT_EULA=Y apt-get -y install mssql-tools

RUN echo 'export PATH="$PATH:/opt/mssql-tools/bin"' >> ~/.bashrc \
  && /bin/bash -c "source ~/.bashrc"

RUN apt-get -y install unixodbc-dev \
  && apt-get install -y libgssapi-krb5-2

# things to make database.py work
RUN pip3 install --upgrade pip
RUN pip3 install -r requirements.txt

## Set the environment variable for the flask application here:
ENV FLASK_APP flask_api

ENTRYPOINT [ "python", "-u", "-m", "flask", "run", "--host=0.0.0.0", "--port=4000"]
