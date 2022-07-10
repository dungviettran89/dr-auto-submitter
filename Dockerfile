FROM zenika/alpine-chrome:102-with-node
USER root
WORKDIR /app
ADD . .
RUN chown -R chrome /app
USER chrome
RUN npm i
ENV PUPPETEER_EXECUTABLE_PATH /usr/bin/chromium-browser
ENTRYPOINT ["/usr/bin/npm","run","start","--"]
CMD ["-h"]
