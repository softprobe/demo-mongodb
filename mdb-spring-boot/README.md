
# Quick start

## Build
```
mvn clean package
```

## Create an app on Softprobe console

Copy the following settings from the app settings
```
-Darex.service.name=a2aa3b1a3cd8c614 -Darex.api.token=QZMO:H1hUA7BIMvyGXf1GkuoIOjX+enFHt8EJgzvViay9gCdaH4JDhBNBPMfQ3yfdPiyjypTloF4o9OTFlhTVRlLXmw==  -Darex.storage.service.host=storage.softprobe.ai
```

## Start Mongodb 

```
docker run --name mongodb -p 27017:27017 -d mongodb/mongodb-community-server:latest
```

## Run the application

```
java -javaagent:arex-agent.jar -Darex.service.name=a2aa3b1a3cd8c614 -Darex.api.token=QZMO:H1hUA7BIMvyGXf1GkuoIOjX+enFHt8EJgzvViay9gCdaH4JDhBNBPMfQ3yfdPiyjypTloF4o9OTFlhTVRlLXmw==  -Darex.storage.service.host=storage.softprobe.ai -jar target\mdb-spring-boot-0.0.1-SNAPSHOT.jar
```

Then query the API

```
curl http://localhost:8080/api/groceries
```

Now you should be able to see the recording