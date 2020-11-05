FROM zenika/alpine-chrome:with-node
ENTRYPOINT ["/usr/bin/npx","dr-auto-submit"]
CMD ["-h"]
