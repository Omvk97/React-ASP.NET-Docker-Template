# --- api stage ---
FROM mcr.microsoft.com/dotnet/core/sdk:3.1 as apibuild

ARG BUILDCONFIG=RELEASE
ARG VERSION=1.0.0

COPY ./API/API.csproj /build/API.csproj

RUN dotnet restore ./build/API.csproj

COPY ./API/ /build/

WORKDIR /build/

RUN dotnet publish ./API.csproj -c ${BUILDCONFIG} -o out /p:Version=${VERSION}



# --- ui stage ---
FROM node AS uibuild

COPY ./interface/package-lock.json /app/package-lock.json
COPY ./interface/package.json /app/package.json

WORKDIR /app/

# Installing dependencies (including dev dependencies because of typescript)
RUN npm ci

COPY ./interface/ /app/

# Create a production build - this will generate a folder inside /app/build which can be served
RUN npm run build



# --- final stage ----
FROM ubuntu:19.10

LABEL Maintainer="Oliver Marco van Komen"

RUN apt-get update && \
    apt-get install -y wget curl && wget https://packages.microsoft.com/config/ubuntu/19.10/packages-microsoft-prod.deb -O packages-microsoft-prod.deb && \
    dpkg --purge packages-microsoft-prod && dpkg -i packages-microsoft-prod.deb && \
    apt-get update && \
    apt-get install aspnetcore-runtime-3.1 -y && \
    curl -sL https://deb.nodesource.com/setup_12.x | bash - && \
    apt-get install -y nodejs build-essential supervisor && \
    npm install -g serve

ENV API_HOME=/opt/api
ENV UI_HOME=/opt/ui

ENV ASPNETCORE_ENVIRONMENT=Production

# Copy scripts
COPY scripts /tmp/
RUN chmod +x /tmp/*.sh && \
    mv /tmp/* /usr/bin && \
    rm -rf /tmp/*

COPY --from=apibuild /build/out ${API_HOME}

COPY --from=uibuild /app/build ${UI_HOME}

COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf

CMD [ "docker-entrypoint.sh" ]