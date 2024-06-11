FROM openjdk:22
VOLUME /tmp
COPY target/*.jar MyHeardle.jar
ENTRYPOINT ["java","-jar","/MyHeardle.jar"]