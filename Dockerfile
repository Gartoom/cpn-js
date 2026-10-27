# Modified Docker distribution, 2026-10-27. See LICENSE and NOTICE.md.
FROM node:14-bullseye AS frontend
WORKDIR /src
COPY LICENSE /tmp/CPNIDE-LICENSE
COPY cpn-ide-front/package*.json ./
RUN npm ci --ignore-scripts --no-audit --no-fund
COPY cpn-ide-front/ ./
ARG CPN_SOURCE_REF=master
ENV NODE_OPTIONS=--max-old-space-size=1536 NG_CLI_ANALYTICS=false
RUN printf "export class AppVersion { public static readonly buildVersion = '1.24.1031-docker'; }" > src/app/app.version.ts \
    && node -e "const fs=require('fs');const ref=process.env.CPN_SOURCE_REF;if(!/^(master|[a-f0-9]{40})$/.test(ref))throw Error('Invalid source ref');const p='src/assets/modern/source-license.html';fs.writeFileSync(p,fs.readFileSync(p,'utf8').replace(/__CPN_SOURCE_REF__/g,ref));" \
    && ./node_modules/.bin/ng build --prod --build-optimizer=false --base-href ./ --output-path=/web \
    && cp /tmp/CPNIDE-LICENSE /web/LICENSE

FROM eclipse-temurin:8-jdk-jammy AS backend
# Dependency on frontend also keeps the two memory-intensive builds sequential.
COPY --from=frontend /web/ /assembly/BOOT-INF/classes/static/
WORKDIR /src
COPY backend/ ./backend/
RUN printf 'rootProject.name="backend"\ninclude ":cpn-ide-back"\n' > backend/settings.gradle
WORKDIR /src/backend
RUN chmod +x gradlew && ./gradlew --no-daemon --max-workers=2 :cpn-ide-back:bootJar \
    && cp cpn-ide-back/build/libs/cpn-ide-back-1.28-SNAPSHOT.jar /assembly/cpnide.jar \
    && cd /assembly && jar uf cpnide.jar BOOT-INF/classes/static

FROM --platform=linux/386 i386/debian:bookworm-slim AS libc32

FROM eclipse-temurin:8-jre-jammy AS runtime
COPY --from=libc32 /lib/i386-linux-gnu/ /lib/i386-linux-gnu/
COPY --from=libc32 /lib/ld-linux.so.2 /lib/ld-linux.so.2
WORKDIR /app
COPY --from=backend /assembly/cpnide.jar /app/cpnide.jar
COPY LICENSE /app/LICENSE
COPY docker/start.sh /app/start.sh
COPY docker/application.properties /app/docker.properties
RUN useradd -m -u 1000 cpn && mkdir -p /data /store \
    && chown cpn:cpn /data /store /app && chmod +x /app/start.sh
USER cpn
WORKDIR /data
ENV JAVA_TOOL_OPTIONS="-Xms32m -Xmx512m -XX:MaxMetaspaceSize=192m -XX:ReservedCodeCacheSize=64m -XX:+UseSerialGC -XX:MinHeapFreeRatio=10 -XX:MaxHeapFreeRatio=30 -XX:CICompilerCount=2 -Djava.awt.headless=true"
EXPOSE 8080
CMD ["/app/start.sh"]
