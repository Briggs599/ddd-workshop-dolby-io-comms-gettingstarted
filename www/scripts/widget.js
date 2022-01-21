

const widget = async () => {

    var thisWidgetScript = document.getElementById('dolbyio-widget-script');

    const getConfig = async () => {
        let result = await fetch(thisWidgetScript.dataset.config);
        let config = await result.json();
        return config;
    }

    let config = await getConfig();


    const createSDKScript = async () => {
        var script = document.createElement('script');
        script.type = "text/javascript";
        script.id = 'sdk';
        script.src = config.VoxeetSDK;
        document.getElementsByTagName('head')[0].appendChild(script);
    }

    const createClientScript = async () => {
        var script = document.createElement('script');
        script.type = "text/javascript";
        script.id = 'client'
        script.src = config.client;
        document.getElementsByTagName('body')[0].appendChild(script);
    }

    const createUIScript = async () => {
        var script = document.createElement('script');
        script.type = "text/javascript";
        script.id = 'ui';
        script.src = config.ui;
        document.getElementsByTagName('body')[0].appendChild(script);
    }


    const defer = (method) => {
        if (window.VoxeetSDK) {
            init(VoxeetSDK);
            return
        } else {
            // add our SDK to head and UI and Client scripts
                try {
                    Promise.all([createSDKScript()]);
                    setTimeout(() => {
                        defer(method);
                    }, 1000)
                } catch(e) {
                    console.log("_____error injecting scripts:", e)
                }
        }
    }


    defer();

    const init = (VoxeetSDK) => {
      
        console.log("VoxeetSDK init");

        console.log(VoxeetSDK.version);
       await Promise.all([createUIScript(),createClientScript()]);

        let appHTML = `
        <div id="app"> 
        <div class="container">
        <button id="settingsBtn" class="btn-primary">Check Version</button>
        </div>
        <h1 id="name-message">Logging in...</h1>
        <!-- Join or Leave a Conference -->
        <div id="form">
            <label>Conference alias :</label>
            <input id="alias-input" value="dev-portal" />
            <button id="join-btn" disabled>Join</button>
            <button id="leave-btn" disabled>Leave</button>
           
            <div class="container">
                <label id="label-dolby-voice" class="text text-primary"></label>
                <div role="group" class="btn-group">
                    <button class="btn btn-primary" type="button" disabled>Off</button>
                    <button class="btn btn-primary" type="button">On</button>
                </div>
            </div>
        </div>

        <!-- Actions on Video and Screen Share -->
        <div id="actions">
            <button id="start-video-btn" disabled>Start video</button>
            <button id="stop-video-btn" disabled>Stop video</button>
            <button id="start-audio-btn" disabled>Start audio</button>
            <button id="stop-audio-btn" disabled>Stop audio</button>
            <button id="start-screenshare-btn" disabled>Start screen share</button>
            <button id="stop-screenshare-btn" disabled>Stop screen share</button>
        </div>

        <!-- Recording Actions and Status -->
        <div id="recording">
            <button id="start-recording-btn" disabled>Start recording</button>
            <button id="stop-recording-btn" disabled>Stop recording</button>
            <p id="record-status" style="color: red;"></p>
        </div>

        <!-- Media Devices Selection -->
        <div id="media-devices">
            <h3>Media Devices</h3>
            <!-- Video Devices -->
            <div class="media-devices-video-input">

                <label for="video-devices">Camera </label>
                <select id="video-devices" class="custom-select"></select>
                <button id="set-video-device-btn" type="button" disabled>Set</button>
            </div>

            <!-- Input Audio Devices -->
            <div class="media-devices-audio-input">
                <label for="input-audio-devices">Microphone/Aux </label>
                <select id="input-audio-devices" class="custom-select"></select>
                <button id="set-input-audio-device-btn" type="button" disabled>Set</button>
            </div>

            <!-- Output Audio Devices -->
            <div class="media-devices-audio-output">
                <label for="output-audio-devices">Speaker/Aux Output </label>
                <select id="output-audio-devices" class="custom-select"></select>
                <button id="set-output-audio-device-btn" type="button" disabled>Set</button>
            </div>
        </div>
        <!-- Display the list of participants -->
        <div id="participants">
            <h3>Participants</h3>
            <ul id="participants-list"></ul>
        </div>

        <!-- Container for the video streams -->
        <div id="video-container"></div>

        <!-- Container for the Screen Share -->
        <div id="screenshare-container"></div>
    </div>
        `

        // let html = `
        // <div class="container">
        // <button id="settingsBtn" class="btn-primary">Settings</button>
        // </div>`
        const widgetContainer = document.querySelector('.dolbyio-widget') // our div
        console.log(widgetContainer)

        widgetContainer.insertAdjacentHTML('beforeend', appHTML)

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

