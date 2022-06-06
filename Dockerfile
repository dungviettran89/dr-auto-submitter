FROM zenika/alpine-chrome:102-with-node
WORKDIR /usr/src/app
ADD . .
RUN npm i
ENV PUPPETEER_EXECUTABLE_PATH /usr/bin/chromium-browser
ENTRYPOINT ["/usr/bin/npm","run","start","--"]
CMD ["-h"]
