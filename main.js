
class ImageOperation {
    constructor() {
        
    }
    CropImage(image ,x1 , y1 , x2 , y2){
        this.imageDatasB64 = null

        let Orgimage = $(image).get(0)

        let obtainImageData = this.GetImageData({
            imageElem : Orgimage,
            x1 : x1,
            y1 : y1,
            x2 : x2,
            y2 : y2
        })

        // create anther beacuse for update image

        let canvasUpdate = document.createElement('canvas')

        canvasUpdate.height = 500
        canvasUpdate.width = 500

        let ctxUpdate = canvasUpdate.getContext('2d')

        ctxUpdate.rect(0, 0, x2, y2);

        ctxUpdate.fillStyle = 'white';
        
        ctxUpdate.fill();

        ctxUpdate.putImageData(obtainImageData , 0 , 0)

        this.imageDatasB64 = canvasUpdate.toDataURL('image/png')

    }
    GetImageData(imgObj) {

        let canvas = document.createElement('canvas')
        
        canvas.height = imgObj.imageElem.height 

        canvas.width =  imgObj.imageElem.width

        let ctx = canvas.getContext('2d')

        ctx.drawImage(imgObj.imageElem ,0 , 0, imgObj.imageElem.width , imgObj.imageElem.height)

        let imageData = ctx.getImageData(imgObj.x1 , imgObj.y1 , imgObj.x2 , imgObj.y2)

        return imageData
    }
    FilterImage(image , color) {

        this.filterImageArray.push(this.imageDatasB64)

        let Orgimage = $(image).get(0)

        let filterCanvas = document.createElement("canvas")

        filterCanvas.height = Orgimage.height
        filterCanvas.width =  Orgimage.width

        let filterCtx = filterCanvas.getContext('2d')

        let obtainImageData = this.GetImageData({
            imageElem : Orgimage,
            x1 : 0,
            y1 : 0,
            x2 : Orgimage.width,
            y2 : Orgimage.height
        })
        // filter rule
        
        for (let i = 0; i < obtainImageData.data.length; i += 4) {
            obtainImageData.data[i] = 255 - obtainImageData.data[i];
            obtainImageData.data[i+1] = 255 - obtainImageData.data[i+1];
            obtainImageData.data[i+2] = 255 - obtainImageData.data[i+2];
            obtainImageData.data[i+3] = 100;
        }


        filterCtx.putImageData(obtainImageData , 0 , 0)

        this.imageDatasB64 = filterCanvas.toDataURL('image/png')

    }
    EditImage(image) {
        let Orgimage = $(image).get(0) 

        let DrawCanvas =  document.getElementById('imageEdit')

        let DrawCtx = DrawCanvas.getContext('2d')

        DrawCanvas.height = Orgimage.height
        DrawCanvas.width = Orgimage.width
        
        DrawCtx.drawImage(Orgimage , 0 , 0 , Orgimage.width , Orgimage.height)

        let DrawImageData = DrawCtx.getImageData(0 , 0 , Orgimage.width , Orgimage.height)

        DrawCtx.putImageData(DrawImageData , 0 , 0)


    }
    updateImageBase64(base) {   
        console.log(base)
    }
    // pass the Image to show in canvas one for editing ImageEdit and a image id <img id = "im">
    PlotingImage( image  ) { 
        
        this.imageBackups.push(this.imageDatasB64)

        return new Promise((resolve , reject) => {
            let f = document.getElementById("imageEdit")

            let Orgimage = $("#im").get(0) 

			let DrawCanvas =  document.getElementById('imageEdit')

			let DrawCtx = DrawCanvas.getContext('2d')

			DrawCanvas.height = Orgimage.height
			DrawCanvas.width = Orgimage.width
			
			DrawCtx.drawImage(Orgimage , 0 , 0 , Orgimage.width , Orgimage.height)
			
			let arr = []
			function mousemove (e) {
				// console.log(e.pageY - f.offsetTop ,e.pageX - f.offsetLeft)
				let x = e.pageX - f.offsetLeft
				let y = e.pageY - f.offsetTop
			
				arr.push({ x , y })

				if (arr.length > 1){
					DrawCtx.moveTo(arr[0].x , arr[0].y)
					DrawCtx.lineTo(arr[1].x , arr[1].y)
					DrawCtx.closePath();
					DrawCtx.stroke();
					
					let temp = arr.pop()
					arr[0] = temp
				}
			}
			let DrawImageData = DrawCtx.getImageData(0 , 0 ,1366 , 768)
        
        	DrawCtx.putImageData(DrawImageData , 0 , 0)
			function MouseDown(e) {
				f.addEventListener('mousemove' , mousemove)
            }

			f.addEventListener('mousedown' , (e) => { 
                MouseDown(e)
            }, false)
            f.addEventListener('mouseup' , (e) => {
                arr = []
                this.imageDatasB64 = DrawCanvas.toDataURL('image/png')   
                resolve(this.imageDatasB64)
                
                this.imageBackups.push(this.imageDatasB64)

				f.removeEventListener('mousemove' , mousemove)
            })
        })
    }
    
    putPixel() {
        let DrawImageData = this.DrawCtx.getImageData(0 , 0 , 1366 , 768)
        
        this.DrawCtx.putImageData(DrawImageData , 0 , 0)
    }
    ImageBackup() {

    }
    UndoFilterImage() {
        console.log(this.imageBackups.length)
        this.imageDatasB64 = this.imageBackups.pop()
    }
    
}

class MediaCapture extends ImageOperation{
    // for tesing

    imageBackups = []

    DrawCanvas
    DrawCtx
    // filter color 
    filterColor = {
        "black" : 255,
    }
    DrawOnImage = []
    checkValue = 0
    //

    BlobChunks = []
    videoStream = null
    audioStream = null
    combineStream = null
    mediaRecorder = null
    recordUrl = null
    MediaCaptureName = null
    combineArray = []
    screenshot = null
    config
    imageDatasB64
    filterImageArray = []
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
    GetVideoStream() {
        return this.videoStream
    }
    GetAudioStream() {
        return this.audioStream
    }
    GetCombineStream () {
        return this.combineStream
    }
    StartDisplayStream() {
        return navigator.mediaDevices.getDisplayMedia({ video : true , audio : true })
    }
    StartAudioStream() {
        return navigator.mediaDevices.getUserMedia({ audio : true })
    }
    async GetAllWithMicrphoneStream() {
        try {
            this.videoStream = await this.StartDisplayStream()

            this.audioStream = await this.StartAudioStream()

            this.combineArray.push([ ...this.videoStream.getTracks() , ...this.audioStream.getTracks() ])
            this.StartRecord()
        }catch(e) {
            this.videoStream.getTracks().forEach((track) => track.stop())
            this.audioStream.getTracks().forEach((track) => track.stop())
            console.log("okay false")           
        }
    }
    async RecordDisplayOnly() {
        this.videoStream = await this.StartDisplayStream()
        this.combineArray.push([ ...this.videoStream.getTracks() ])

        this.StartRecord()
    }
    async RecordMircophone() {
        this.audioStream = await this.StartAudioStream()
        this.combineArray.push([ ...this.audioStream.getTracks() ])

        this.StartRecord()
    }
    
    StartRecord() {
        this.combineStream = new MediaStream(this.combineArray[0])

        this.mediaRecorder = new MediaRecorder(this.combineStream , { mimeType : 'video/webm' })

        this.mediaRecorder.addEventListener('dataavailable', event => {
            if (event.data && event.data.size > 0) {
                if (this.playbackStatus == true) {
                    // data chunk not save
                }else {
                    this.BlobChunks.push(event.data);
                }   
            }
        })
        this.mediaRecorder.addEventListener('pause', event => {
            console.log('paused')
        })
        this.mediaRecorder.addEventListener('resume' , event => {
            console.log('resumed')
        })
        this.mediaRecorder.start(0)

        if (this.videoStream == null) {
            /** */
        }else {
            this.videoStream.addEventListener('inactive' , (e) => {
                if (this.mediaRecorder == null) {
                
                }else {
                    this.StopRecording(e)
                }
            })
        }
    }
    MediaFile() {

    }
    PauseResume() {
        if (this.playbackStatus == true) {
            this.mediaRecorder.resume()
            this.playbackStatus = false
        }else {
            this.mediaRecorder.pause()
            this.playbackStatus = true
        }
        return this.playbackStatus
    }
    StopRecording() {
        this.mediaRecorder.stop()
        this.mediaRecorder = null
        
        if (this.videoStream == null) {
            this.audioStream.getTracks().forEach((track) => track.stop())
        }
        if (this.audioStream == null) {
            this.videoStream.getTracks().forEach((track) => track.stop())
        }
        if (this.videoStream != null && this.audioStream != null){
            this.videoStream.getTracks().forEach((track) => track.stop())
            this.audioStream.getTracks().forEach((track) => track.stop())
        }
        
        this.videoStream = null
        this.audioStream = null

        this.recordUrl = window.URL.createObjectURL(new Blob(this.BlobChunks , { type : 'video/webm' }))
    }
    ConvertBlob() {
        return this.recordUrl
    }
    async ScreenShot(flag) {
        if (this.videoStream == null) {
            this.videoStream = await this.StartDisplayStream()
        }
            
        let track = this.videoStream.getVideoTracks()[0]

        let imageCapture = new ImageCapture(track);

        let img = await imageCapture.grabFrame()
            
        let can = document.createElement('canvas')
            
        can.width = window.innerWidth;
        can.height = window.innerHeight;
            
        let ctx = can.getContext('2d')
            
        ctx.drawImage(img , 0 , 0 , 1366 , 768)

        let base64ImageData = can.toDataURL('image/png' , 1)
            
        this.imageDatasB64 = base64ImageData

        if (flag == true) {
            this.videoStream.getTracks().forEach((track) => track.stop())
        }
        
    }
    SaveScreenShot() {
        if(this.imageDatasB64 == null) {
            return null
        }else {
            const blob = this.Base64ToBLob(this.imageDatasB64.split(',')[1] , 'image/png')
            const blobUrl = window.URL.createObjectURL(blob)

            this.imageDatasB64 = null
            return blobUrl
        }   
    }
    Base64ToBLob(b64Data , contentType = '' , sliceSize = 512) {
        const byteCharacters = atob(b64Data);
        const byteArrays = [];
      
        for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
          const slice = byteCharacters.slice(offset, offset + sliceSize);
      
          const byteNumbers = new Array(slice.length);
          for (let i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
          }
      
          const byteArray = new Uint8Array(byteNumbers);
          byteArrays.push(byteArray);
        }
      
        const blob = new Blob(byteArrays, {type: contentType});
        return blob;
    }
}