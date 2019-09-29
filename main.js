/**
 * image class for image operation
 */
class ImageOperation {
    constructor() {
        
    }
    /**
     * @function - for croping image for whre i want to cut 
     * @param {*} image  image if
     * @param {*} x1  start x
     * @param {*} y1  strat y
     * @param {*} x2  end x
     * @param {*} y2 end y
     */
    CropImage(x1 , y1 , x2 , y2){
        // this.imageDatasB64 = null

        // create anther beacuse for update image

        let canvasUpdate = document.createElement('canvas')

        canvasUpdate.height = x2
        canvasUpdate.width = y2

        let ctxUpdate = canvasUpdate.getContext('2d')

        HTMLCanvasElement.prototype.renderImage = (blob) => {

            let img = new Image()
            
            img.src = this.imageDatasB64

            img.onload = () => {
                // DrawCtx.drawImage(img , 0 , 0) 
                let obtainImageData = this.GetImageData({
                    imageElem : img,
                    x1 : x1,
                    y1 : y1,
                    x2 : x2,
                    y2 : y2
                }) 
                
                ctxUpdate.rect(x1, y1, x2, y2);

                ctxUpdate.fillStyle = 'white';
                
                ctxUpdate.fill();

                ctxUpdate.putImageData(obtainImageData , 0 , 0)

                this.imageDatasB64 = canvasUpdate.toDataURL('image/png')

                this.imageBackups.push(this.imageDatasB64)
                
                this.updateImage()
            }
        }

        DrawCanvas.renderImage(this.Base64ToBLob(this.imageDatasB64.split(',')[1] , 'image/png'))

    }
    /**
     * 
     * @param {*} imgObj getting image for canvas
     */
    GetImageData(imgObj) {

        let canvas = document.createElement('canvas')
        
        canvas.height = this.windowFullheight 

        canvas.width =  this.windowFullWidth

        let ctx = canvas.getContext('2d')

        ctx.drawImage(imgObj.imageElem ,0 , 0, this.windowFullWidth , this.windowFullheight)

        let imageData = ctx.getImageData(imgObj.x1 , imgObj.y1 , imgObj.x2 , imgObj.y2)

        return imageData
    }
    /**
     * @function FilterImage
     * @wjhat - chage the color of image
     * @param {*} image for getting image id 
     * @param {*} color for color 
     * @param {*} brightness for hight light
     */
    FilterImage(image , color , bright = 1) {

        // let Orgimage = $(image).get(0)

        let filterCanvas = document.createElement("canvas")

        filterCanvas.height = this.windowFullheight
        filterCanvas.width =  this.windowFullWidth

        let filterCtx = filterCanvas.getContext('2d')


        HTMLCanvasElement.prototype.renderImage = (blob) => {

            let img = new Image()
            
            img.src = this.imageDatasB64

            img.onload = () => {
                // call gettingimagedata ( { ... })  
                let obtainImageData = this.GetImageData({
                    imageElem : img,
                    x1 : 0,
                    y1 : 0,
                    x2 : this.windowFullWidth,
                    y2 : this.windowFullheight
                }) 
                
                for (let i = 0; i < obtainImageData.data.length; i += 4) {
                    obtainImageData.data[i] = 255 - obtainImageData.data[i] * bright; // red
                    obtainImageData.data[i+1] = 255 - obtainImageData.data[i+1] * bright; // green
                    obtainImageData.data[i+2] = 255 - obtainImageData.data[i+2] * bright; // blue
                    obtainImageData.data[i+3] = 255; // alpha
                }

                filterCtx.putImageData(obtainImageData , 0 , 0)

                this.imageDatasB64 = filterCanvas.toDataURL('image/png')

                this.imageBackups.push(this.imageDatasB64)
                
                this.updateImage()
            }
        }

        DrawCanvas.renderImage(this.Base64ToBLob(this.imageDatasB64.split(',')[1] , 'image/png'))
    }
    /**@function EditImage
     * @what - plot image in screen
     * @param image but is not used at time future use
     */
    EditImage(image) {

    }
    updateImageBase64(base) {   
        console.log(base)
    }
    
     /**
     * function name - DrawFreeOnImage(image , imageEdit)
     * what - this is for ploting image on dcoument and editing on image like draw handwriting free hand ect
     * @param - (image , imageEdit)
     *        -  image is image sorce like img src 
     *        -  imageEdit is for canvas data to writing and any change on it
     * return - promised based data
     */ 
    DrawFreeOnImage(color) {

        // return promise to user handel self
        // return new Promise((resolve , reject) => {
            // it is for getting image data canvas  for adding EventListener
            let f = document.getElementById("imageEdit")

            // by jquery handle it to getting imageObject
            // let Orgimage = $("#im").get(0) 

            // drawing on canvas image
            let DrawCanvas =  document.getElementById('imageEdit')

            let DrawCtx = DrawCanvas.getContext('2d')

            DrawCanvas.height = this.windowFullheight
            DrawCanvas.width = this.windowFullWidth
            
            DrawCtx.drawImage(Orgimage , 0 , 0 , this.windowFullWidth , this.windowFullheight)
            
            HTMLCanvasElement.prototype.renderImage = (blob) => {
               
                let DrawCtx = DrawCanvas.getContext('2d')
    
                let img = new Image()
                
                img.src = this.imageDatasB64
    
                img.onload = () => {
                    DrawCtx.drawImage(img , 0 , 0)   
                }
            }

            DrawCanvas.renderImage(this.Base64ToBLob(this.imageDatasB64.split(',')[1] , 'image/png'))
            
            let arr = [] // for handle mouse move and handsktech method x , y  coor dtore
            
            // mousemove funtion 
            function mousemove (e) {
                
                let x = e.pageX - f.offsetLeft //  getting actual postion on canvas
                let y = e.pageY - f.offsetTop // getting actual postion on canvas
            
                // pushing x , y as object in arr 
                arr.push({ x , y })

                // check arr len and all down function to draw pixel on image
                if (arr.length > 1){
                    DrawCtx.lineJoin = 'round'
                    DrawCtx.lineCap = 'round'

                    DrawCtx.moveTo(arr[0].x , arr[0].y)
                    DrawCtx.lineTo(arr[1].x , arr[1].y)
                    DrawCtx.closePath();
                    DrawCtx.strokeStyle = color;
                    DrawCtx.lineWidth = 5
                    
                    DrawCtx.stroke();
                    
                    let temp = arr.pop() // for every last elem set first in aarray
                    arr[0] = temp
                }
            }
           
            
            // mouse Down then start mouse move
            function MouseDown(e) {
                f.addEventListener('mousemove' , mousemove)
            }
            // f here is canvas because to set 
            f.addEventListener('mousedown' , (e) => { 
                MouseDown(e)
            }, false)
            // on mouse up 
            f.addEventListener('mouseup' , (e) => {
                arr = [] // blankthe array
                
                // convert current image data 
                this.imageDatasB64 = DrawCanvas.toDataURL('image/png')   
                
                // thens send to user
                // resolve(this.imageDatasB64)
                
                // store image backup for any changed 
                this.imageBackups.push(this.imageDatasB64)

                 // getting image data 
                let DrawImageData = DrawCtx.getImageData(0 , 0 ,1366 , 768)
        
                // put image data on image documnet
                DrawCtx.putImageData(DrawImageData , 0 , 0)

                
                // remmoving dom event
                f.removeEventListener('mousemove' , mousemove)
                
            })
            // this is for only expermental purpose
            f.addEventListener("dblclick" , (e) => {
                console.log("hello")
                let x = e.pageX - f.offsetLeft //  getting actual postion on canvas
                let y = e.pageY - f.offsetTop // getting actual postion on canvas
                
                let data = "okay" // this given by user

                DrawCtx.font = "30px Verdana"

                DrawCtx.strokeText(data , x, y);
                
                this.imageDatasB64 = DrawCanvas.toDataURL('image/png')   
                
                // thens send to user
                // resolve(this.imageDatasB64)
                
                // store image backup for any changed 
                this.imageBackups.push(this.imageDatasB64)

                 // getting image data 
                let DrawImageData = DrawCtx.getImageData(0 , 0 ,1366 , 768)
        
                // put image data on image documnet
                DrawCtx.putImageData(DrawImageData , 0 , 0)

                // this.InsertedText = ""
            })
        // })
    }
    /**
     *  not in use for future purpose
     */
    putPixel() {
        let DrawImageData = this.DrawCtx.getImageData(0 , 0 , this.windowFullWidth , this.windowFullheight)
        
        this.DrawCtx.putImageData(DrawImageData , 0 , 0)
    }
    /**
     * 
     */
    updateImage() {
        let DrawCanvas =  document.getElementById('imageEdit')

        let DrawCtx = DrawCanvas.getContext('2d')

            DrawCanvas.height = this.windowFullheight
            DrawCanvas.width = this.windowFullWidth
            
            DrawCtx.drawImage(Orgimage , 0 , 0 , this.windowFullWidth , this.windowFullheight)
            
            HTMLCanvasElement.prototype.renderImage = (blob) => {
               
                let DrawCtx = DrawCanvas.getContext('2d')
    
                let img = new Image()
                
                img.src = this.imageDatasB64
    
                img.onload = () => {
                    DrawCtx.drawImage(img , 0 , 0)   
                }
            }

            DrawCanvas.renderImage(this.Base64ToBLob(this.imageDatasB64.split(',')[1] , 'image/png'))
    }
    ImageBackup() {

    }
     /**
     * function name - undoFilterImage
     * what - for restore image when it is edit through canvas
     */ 
    UndoFilterImage() {
        if (this.imageBackups.length == 1) {
            this.imageDatasB64 = this.imageBackups[0]
        }else {
            this.imageDatasB64 = this.imageBackups.pop()
        }
        this.updateImage()
    }
    
}

class MediaCapture extends ImageOperation{
    // for tesing
    windowFullheight = 768
    windowFullWidth = 1366
    imageBackups = [] //  for image writing changed in it

    DrawCanvas // draw canvas bu tnit in iused
    DrawCtx // not in used canavs
    // filter color 
    filterColor = { // not use bu future 
        "black" : 255,
    }
    DrawOnImage = []
    checkValue = 0
    //

    BlobChunks = [] // stream chunks 
    videoStream = null //  video stream
    audioStream = null // audio ...
    combineStream = null // both audio and video some time only video and audio 
    mediaRecorder = null // media recoder 
    recordUrl = null // blob url 
    MediaCaptureName = null // 
    combineArray = [] //  used as combine stream 
    screenshot = null // screenshots
    config // config this is not sstable
    imageDatasB64 // store final image in base64 
    filterImageArray = [] //  filter imaage but it us not stable use
    // video and audio configuration
    displayAudio = null 
    displayVideo = null
    microphone = null
    // handle pause , resume
    playbackStatus = false // true pause .. false resume

    constructor(config) {
        super("#im")
        this.config = config
        this.displayAudio = config.device_audio_capturing
        this.displayVideo = config.display_capturing
        this.microphone   = config.microphone_capturing
        
        console.log(this.config.device_audio_capturing)
        
    }
    /** this is for return to user not for interbal use 
     *  GetVideoStream
     *  GetAudioStream
     *  GetCombineStream
     */
    GetVideoStream() {
        return this.videoStream
    }
    GetAudioStream() {
        return this.audioStream
    }
    GetCombineStream () {
        return this.combineStream
    }
     /**
     * function name - StartDisplayStream
     * what - only for initilaze media capture api
     * return - media with promise based
     */ 
    StartDisplayStream() {
        return navigator.mediaDevices.getDisplayMedia({ video : true , audio : true })
    }
     /**
     * function name - StartAudiioStream
     * what - only for initilaze media capture api
     * return - media with promise based
     */ 
    StartAudioStream() {
        return navigator.mediaDevices.getUserMedia({ audio : true })
    }
     /**
     * function name - GetAllWithMicrphone 
     * what - record all type of stream like audio and system audio and video steam
     */ 
    async GetAllWithMicrphoneStream() {
        try {
            // for video
            this.videoStream = await this.StartDisplayStream()

            // for audio
            this.audioStream = await this.StartAudioStream()

            // combine both in single array
            this.combineArray.push([ ...this.videoStream.getTracks() , ...this.audioStream.getTracks() ])
            
            // call start
            this.StartRecord()
        }catch(e) {

            // if error then stop all stream
            this.videoStream.getTracks().forEach((track) => track.stop())
            this.audioStream.getTracks().forEach((track) => track.stop())    
        }
    }
     /**
     * function name - RecordDiskplayOnly 
     * what - record audio stream function call
     */ 
    async RecordDisplayOnly() {
        // getting stream video
        this.videoStream = await this.StartDisplayStream()

        // combine in araru video stream
        this.combineArray.push([ ...this.videoStream.getTracks() ])

        // call function
        this.StartRecord()
    }
    /**
     * function name - RecordMicrphone 
     * what - this is for only record mivrphone stteam video not mentioned
     */ 
    async RecordMircophone() {
        // getting stream 
        this.audioStream = await this.StartAudioStream()
        
        // combine in array for because one stream for both so in array
        this.combineArray.push([ ...this.audioStream.getTracks() ])

        // call strat record
        this.StartRecord()
    }
    /**
     * function name - StartRecord()
     * this start record stream with audio and vide but it can record single and multiple data stream
     */ 
    StartRecord() {
        // this mediaStream constructor combine audio and video stream data and make single stream
        this.combineStream = new MediaStream(this.combineArray[0])

        // media recorder Constructor to recording fucntionlity
        this.mediaRecorder = new MediaRecorder(this.combineStream , { mimeType : 'video/webm' })

        // until the media recorder have data the it will send event
        this.mediaRecorder.addEventListener('dataavailable', event => {
            if (event.data && event.data.size > 0) {
                if (this.playbackStatus == true) { //  pause or resume media record
                    // data chunk not save
                }else {
                    // store stream chunks blob object in array 
                    this.BlobChunks.push(event.data); 
                }   
            }
        })
        // when media recorder paused
        this.mediaRecorder.addEventListener('pause', event => {
            console.log('paused')
        })
        // fpr when media reorder resumed 
        this.mediaRecorder.addEventListener('resume' , event => {
            console.log('resumed')
        })
        this.mediaRecorder.start(0) // start media recording 

        if (this.videoStream == null) { // if video already null then not change
            /** */
        }else {
            // video stream inactive when we stop the recording 
            this.videoStream.addEventListener('inactive' , (e) => {
                if (this.mediaRecorder == null) {
                
                }else {
                    // stop function called 
                    this.StopRecording(e)
                }
            })
        }
    }
    MediaFile() {

    }
    /**
     * function name - PauseResume funciton
     * what - Pause state and resume state for skip recording and play back recording
     * return - playback -true or false
     */ 
    PauseResume() {
        if (this.playbackStatus == true) {
            this.mediaRecorder.resume() // resume playback record
            this.playbackStatus = false
        }else {
            this.mediaRecorder.pause() // pause play ...
            this.playbackStatus = true
        }
        return this.playbackStatus
    }
    /**
     * function name - Stoprecording 
     * what - Stop the all stream like audio and video
     */ 
    StopRecording() {
        this.mediaRecorder.stop()
        this.mediaRecorder = null
        
        // for audio stream only 
        if (this.videoStream == null) {
            this.audioStream.getTracks().forEach((track) => track.stop())
        }
        // for video stream only
        if (this.audioStream == null) {
            this.videoStream.getTracks().forEach((track) => track.stop())
        }
        // for both audio and video stream
        if (this.videoStream != null && this.audioStream != null){
            this.videoStream.getTracks().forEach((track) => track.stop())
            this.audioStream.getTracks().forEach((track) => track.stop())
        }
        
        // null because after all not need to store and waste memory
        this.videoStream = null
        this.audioStream = null

        this.recordUrl = window.URL.createObjectURL(new Blob(this.BlobChunks , { type : 'video/webm' }))
    }
    /**
     * function name - ConvertBlob
     * what - return blob url main function
     * return bloburl that is globally stored 
     */ 
    ConvertBlob() {
        return this.recordUrl
    }
    /**
     * function name - async ScreenShot(flag)
     * what - for obatin base64 string from video stream
     * @params - flag = true or false - for checking videostream is for screenshot or live stream
     */ 
    async ScreenShot(flag) {
        if (this.videoStream == null) {
            // for because if video stream is not running then run 
            this.videoStream = await this.StartDisplayStream()
        }
            
        // get last video frame image
        let track = this.videoStream.getVideoTracks()[0]

        // capture image fro video stream
        let imageCapture = new ImageCapture(track);

        // grab image and store for next canvas because it is Bitmap Image Object
        let img = await imageCapture.grabFrame()
            
        // canvas creation not in dom only custom
        let can = document.createElement('canvas')
            
        can.width = this.windowFullWidth;
        can.height = this.windowFullheight;
            
        let ctx = can.getContext('2d')
        
        // change the 1366 because it is fized on fixed screen change it ti adjustable  
        ctx.drawImage(img , 0 , 0 , 1366 , 768)

        let base64ImageData = can.toDataURL('image/png' , 1)
            
        this.imageDatasB64 = base64ImageData

        this.imageBackups = []

        this.imageBackups.push(this.imageDatasB64)

        if (flag == true) {
            
            this.videoStream.getTracks().forEach((track) => track.stop())
            this.videoStream = null
        }
        
    }
    /**
     * function name - SaveScreeenShot
     * what - for converting the base64 data into blob data and return 
     * @params - null
     * return  - bloburl link 
     */ 
    SaveScreenShot() {
        if(this.imageDatasB64 == null) {
            return null
        }else {
            const blob = this.Base64ToBLob(this.imageDatasB64.split(',')[1] , 'image/png') // for blob data
            const blobUrl = window.URL.createObjectURL(blob) // for blob url for link

            this.imageDatasB64 = null
            return blobUrl // return bloob url
        }   
    }
    /**
     * function name - Base64ToBlob 
     * what - for converting the base64 data into blob data
     * @params - b64data - base64 data string
     *         - contentType = 'image/png' - for mime type
     *         - sliceSize = 512 by default 
     * return  - blob data
     */ 
    Base64ToBLob(b64Data , contentType = '' , sliceSize = 1) {
        const byteCharacters = atob(b64Data);
        const byteArrays = []; // storing the sliced base64 string into array
      
        for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
          const slice = byteCharacters.slice(offset, offset + sliceSize);
      
          const byteNumbers = new Array(slice.length);
          for (let i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
          }
      
          const byteArray = new Uint8Array(byteNumbers);
          byteArrays.push(byteArray);
        }
      
        const blob = new Blob(byteArrays, {type: contentType}); // convert base644 to blob
        return blob; // return blob data
    }
}
