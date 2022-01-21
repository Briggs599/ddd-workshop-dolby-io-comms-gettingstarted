

const widget = async () => {

    var thisWidgetScript = document.getElementById('dolbyio-widget-script');


    console.log(thisWidgetScript);

    const getConfig = async () => {
        let result = await fetch(thisWidgetScript.dataset.config);
        let config = await result.json();
        return config;
    }
    let config = await getConfig();


    const createSDKScript = () => {
        var script = document.createElement('script');
        script.type = "text/javascript";
        script.src = config.VoxeetSDK;
        document.getElementsByTagName('head')[0].appendChild(script);
    }

    const createClientScript = () => {
        var script = document.createElement('script');
        script.type = "text/javascript";
        script.src = config.client;
        document.getElementsByTagName('body')[0].appendChild(script);
    }

    const createUIScript = () => {
        var script = document.createElement('script');
        script.type = "text/javascript";
        script.src = config.ui;
        document.getElementsByTagName('body')[0].appendChild(script);
    }


    const defer = (method) => {
        if (window.VoxeetSDK) {
            init(VoxeetSDK);
            return
        } else {
            // add our SDK to head
            createSDKScript();
            setTimeout(() => {
                defer(method);
            }, 50)
        }
    }


    defer();

    const init = (VoxeetSDK) => {
        createClientScript();
        createUIScript();
        console.log("VoxeetSDK init");

        console.log(VoxeetSDK.version);
        //   alert("SDK Version " +  VoxeetSDK.version);

        let html = `
        <div class="container">
        <button id="settingsBtn" class="btn-primary">Settings</button>
        </div>`
        const widgetContainer = document.querySelector('.dolbyio-widget') // our div
        console.log(widgetContainer)

        widgetContainer.insertAdjacentHTML('beforeend', html)

        console.log(widgetContainer)
        // document.getElementsByTagName('body')[0].insertAdjacentHTML('beforeend',html)
        //    document.querySelector(widgetContainer.id);


        const settingsBtn = document.getElementById('settingsBtn');
        settingsBtn.onclick = async () => {
            let version = VoxeetSDK.version;
            alert(`version: ${version}`)
        }

    }
}

document.onreadystatechange = () => {
    if (document.readyState === 'complete') {
        widget()
    }
}

