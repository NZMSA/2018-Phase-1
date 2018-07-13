# Create a Container Registry, Push an Image to Azure Container Registry, and Use an Image for Azure Web App for Containers

In this tutorial you will learn about the Azure Container Registry (ACR) and create your own ACR. You will then subsequently push your Docker image to your newly created ACR, create a web app and deploy it. You will also learn how to redeploy if there have been changes made to your web app.


## Contents:
1. Azure Container Registry (ACR)
    - Overview 
    - Creating an ACR
    - Logging into your ACR
    

2. Web App For Containers
    - Pushing your Docker Image to ACR
    - Creating a Web App for Containers
    - Configuring your Web App to use ACR
    - Changes to the Web App and Redeployment

## Prerequisites:
- An Azure account
- Docker Installed
- Docker Image (A previous tutorial covers this process)
- Azure Cloud Shell / Azure CLI

&nbsp;

## Azure Container Registry (ACR)

### Overview
Docker registries are services that store your docker images. These registries can either be public (meaning anyone can pull a copy of your image) or private (meaning only those authenticated can pull your image). While Docker provides a free public registry, there can be cases where you will need to keep your images private. This is where Azure Docker Registry comes in handy! (Plus with your student Azure subscription you can use this for free!!).

Azure Docker Registry is a container registry serviced used to store private docker images. (A Docker image is essentially file which is a snapshot of a container. They are created based off Dockerfiles and will produce a container once run.)

### Creating an Azure Docker Registry

In order to create an ACR, we first need to create a resource group. A resource group is essentially an "id" that Azure uses to group certain resources. You can then monitor, provision and manage billing for the assets within a resource group which are used to run an application.

If you haven't done so already, please log into Azure CLI using az login in your command prompt window.

```
>az login
```
A browser will launch where you will need to enter your Azure credentials. Once successfully logged in you will receive the follow message in your cmd.
```
You have logged in. Now let us find all subscriptions you have access to...
```

Lets create a new resource group named "dankNotDankRG" in the Australia Southeast location.
```
>az group create --name dankNotDankRG --location australiasoutheast
```
 In the cmd response you should receive a key/value as below which indicates the resource group has been created successfully.
 ```
{
  "id": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/dankNotDankRG",
  "location": "australiasoutheast",
  "managedBy": null,
  "name": "dankNotDankRG",
  "properties": {
    "provisioningState": "Succeeded"
  },
  "tags": null
}
 ```

Now let's create a container registry. Azure Container Registry has many different tiers (SKUs) which could can select from. There are three main SKUs: Basic, Standard, and Premium. For this tutorial we will be using Basic. The main differences between SKUs are in size and usage. If you would like to view the differences each SKU provides, please visit [Container Registry SKUs](https://docs.microsoft.com/en-us/azure/container-registry/container-registry-skus)

To create a container registry, use the az acr create command. We will need to specify our newly created resource group as above, the name of our registry (which must be unique within Azure), and the sku. As the name needs to be unique, please name it as "\<your first & last name>DankRegistry".

```
az acr create --resource-group dankNotDankRG --name khodaSisodiaDankRegistry --sku Basic
```
This can take a few minutes, so please be patient until it returns.
Once created you will get something as below:
```
{
  "adminUserEnabled": false,
  "creationDate": "2018-07-08T10:09:25.597963+00:00",
  "id": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/dankNotDankRG/providers/Microsoft.ContainerRegistry/registries/khodaSisodiaDankRegistry",
  "location": "australiasoutheast",
  "loginServer": "khodasisodiadankregistry.azurecr.io",
  "name": "khodaSisodiaDankRegistry",
  "provisioningState": "Succeeded",
  "resourceGroup": "dankNotDankRG",
  "sku": {
    "name": "Basic",
    "tier": "Basic"
  },
  "status": null,
  "storageAccount": null,
  "tags": {},
  "type": "Microsoft.ContainerRegistry/registries"
}
```
Before we can push or pull container images, we need to first supply our credentials so that the registry accepts the push. In order to obtain the credentials, we will use the az acr show command. In some cases we need to enabled the admin user. To do this:

```
>az acr update --name khodaSisodiaDankRegistry --admin-enabled true
```

You will now note that key "adminUserEnabled has been set to true ``` "adminUserEnabled": true```.

Now lets get the credentials. Enter in the following command. In the --name parameter enter in your own registry name which was created earlier.
```
az acr credential show --name khodaSisodiaDankRegistry
```

This should return something similar to below (but the value will have the proper passwords):
```
{
  "passwords": [
    {
      "name": "password",
      "value": "123456789abcdef"
    },
    {
      "name": "password2",
      "value": "<another value>"
    }
  ],
  "username": "khodaSisodiaDankRegistry"
}
```

Now lets log in to ACR. We will use the command ```docker login``` followed by ```<your-azure-container-registry-name>.azurecr.io --username <registry-username>```. The ```<registry-username>``` is found from the previous command i.e. : ```"username": "khodaSisodiaDankRegistry"```

```
docker login khodaSisodiaDankRegistry.azurecr.io --username khodaSisodiaDankRegistry
```

Once entered, you will be prompted for a password. Enter the value of the password from your cmd which was obtained earlier, ie "123456789abcdef". For security reasons, if you copy-paste your password it wont show up on the cmd, so just hit enter once pasted.

If successful you will get the following message:
```
Login Succeeded
```
### Depending on how your image was built you may need to tag it. If this is the case please follow the below tagging process, else continue to the push.
>As we will be using our own image, you may need to first tag it as follows: ```docker tag <image-id> <azure-container-registry-name>.azurecr.io/mydockerimage```
>
>To get the image id, we will run command:
>```
> >docker images
>```
>
>You will be returned a list of images. Under the image you want to push, copy its corresponding image id.
>
>```
>REPOSITORY                                      TAG                 IMAGE ID            CREATED             SIZE
>khodaSisodiaDankRegistry.azurecr.io/dankimage   v1.0.0             b41ff7640e43         About an hour ago ago         840MB
>node                                            8.11.3              c5e9a81034a9        45 hours ago        673MB
>```
>b41ff7640e43 is the image ID for my image, however this will be different for you.
>
>Lets proceed to tag our image:
>
>```
> >docker tag b41ff7640e43 khodaSisodiaDankRegistry.azurecr.io/dankimage:v1.0.0
>```

Now lets push our Docker Image (which was created in a previous tutorial). To do this we use the docker push command with parameters as follows:  ```<your-azure-container-registry-name>.azurecr.io/<your-docker-image-name>:v1.0.0```

In my case, my command will be:
```
>docker push khodaSisodiaDankRegistry.azurecr.io/dankimage:v1.0.0
```

Pushing the image will take some time, so please be patient.

To verify your image has successfully pushed you can list all the images in your registry as follows: ```az acr repository list -n <azure-container-registry-name>```
```
>az acr repository list -n khodaSisodiaDankRegistry

[
  "dankimage"
]
```


All thats left to do now is to create a web app for containers and configure it to run a container stored in your Azure Container Registry.

Before we create a web app, we will first need to an App Service plan (if you don't already have one.) An app service plan will determine the location, features, cost, and compute resource your web app will have. We will be using the free tier. The command is as follow. ``` az appservice plan create --name <plan-name> --resource-group <resource-group> --sku FREE``` For \<plan-name>, you can enter any name you like. For resource-group, its best to use the resource group you've used for your container above. Finally SKU dictates what plan you want to use. Based on this, my command will look as below:

```
az appservice plan create --name dankServicePlan --resource-group dankNotDankRG --sku FREE
```

A JSON file will be returned once the plan has been created. Now we can go ahead and create our web app. The command to do this is: ```az webapp create --name <webappname> --resource-group <resource -group> --plan <plan-name>```. \<webappname> needs to be unique, so if you use the one which is below, or someone elses it wont work. The resource group is once again the one you've used previously in this tutorial. Finally the \<plan-name> is the plan you created in the previous step above.

```
az webapp create --name ksDankNotDank --resource-group dankNotDankRG --plan dankServicePlan
```

Another JSON file will output on cmd.

Finally we need to configure this newly created service to run the container in our registry. This command is a little longer. Each parameter has been explained below:

```
az webapp config container set 
--name ksDankNotDank //name of your web app from above
--resource-group dankNotDankRG //name of your resource group 
--docker-custom-image-name khodaSisodiaDankRegistry.azurecr.io/dankimage //docker image name
--docker-registry-server-url https://khodaSisodiaDankRegistry.azurecr.io //Your ACR server URL
--docker-registry-server-user khodaSisodiaDankRegistry //This can be obtained using the az acr credential show --name khodaSisodiaDankRegistry command
--docker-registry-server-password 123456789abcdef //The password will also be returned from the az acr cred command.
```

Once this command has run, it will return something similar to:

```
[
  {
    "name": "DOCKER_CUSTOM_IMAGE_NAME",
    "slotSetting": false,
    "value": "mydockerimage"
  },
  {
    "name": "DOCKER_REGISTRY_SERVER_URL",
    "slotSetting": false,
    "value": "<azure-container-registry-name>.azurecr.io"
  },
  {
    "name": "DOCKER_REGISTRY_SERVER_USERNAME",
    "slotSetting": false,
    "value": "<registry-username>"
  },
  {
    "name": "DOCKER_REGISTRY_SERVER_PASSWORD",
    "slotSetting": false,
    "value": null
  }
]
```

Congratulations, you've successfully created a web app using a container! If you navigate to your URL (the name of your webapp + .azurewebsites.net; in this tutorial's case: https://ksdanknotdank.azurewebsites.net/), you should be able to view your web app!
