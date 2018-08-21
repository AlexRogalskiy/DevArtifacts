# cleanup build and staging after pipeline completes
oc project pipeline-app-staging
oc delete all --selector app=jws-app-staging

oc project pipeline-app
oc delete all --selector app=jws31-tomcat8-basic-s2i
oc delete is jws-app-staging
