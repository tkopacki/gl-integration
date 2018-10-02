FROM node:10

EXPOSE 8080
ENV PORT 8080
ENV GITLABAPI "https://gitlab.com"
ENV NODEREDTMPL "http://192.168.0.2"

COPY src/* /
RUN npm install
CMD ["npm", "start"]