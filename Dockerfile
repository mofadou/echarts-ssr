FROM node:16-bullseye-slim

WORKDIR /echarts-ssr

COPY package.json server.js ./

RUN set -eux; \
    apt-get update; \
    apt-get install -y --no-install-recommends -o 'Acquire::Retries=3' \
        fonts-noto-cjk \
    ; \
    rm -rf /var/lib/apt/lists/*; \
    yarn install

CMD ["/usr/local/bin/node", "server.js"]
