// async function media () {
//     let chunks = []
//     let record = null

//     let v1 = document.querySelector('#video1')
//     let v2 = document.querySelector("#video2")
//     let down = document.querySelector("#link")
//     let btn = document.querySelector('#btn')
//     let p = false

    

//     let VideoStream = await navigator.mediaDevices.getDisplayMedia({ video : true , audio : true})
    
//     let audioStream = await navigator.mediaDevices.getUserMedia({ audio : true })
    
//     let CombineStream = new MediaStream([ ...VideoStream.getTracks() , ...audioStream.getTracks() ])
//     v1.srcObject = VideoStream
//     v1.play()
//     // let mediaRecorder = new MediaRecorder(VideoStream, {mimeType: 'video/webm'});
//     let mediaRecorder = new MediaRecorder(CombineStream)

//     mediaRecorder.addEventListener('dataavailable', event => {
//         if (event.data && event.data.size > 0) {
//             if (p == true) {
//                 //
//             }else {
//                 chunks.push(event.data);
//             }
            
            
//         }
//     });
//     mediaRecorder.start(0)

    
//     btn.addEventListener('click' , () => {
//         if (p == false) {
//             p = true
//             mediaRecorder.pause()
//             console.log('record paused')
            
            
//         }else {
//             p = false
//             mediaRecorder.resume()
//             console.log('record play')
//         }
        
//     })
    
    
//     VideoStream.addEventListener('inactive' , (e) => {
        
//         mediaRecorder.stop();
//         mediaRecorder = null
//         VideoStream.getTracks().forEach((t) => t.stop())
//         audioStream.getTracks().forEach((t) => t.stop())
//         VideoStream = null
//         audioStream = null
//         record = window.URL.createObjectURL(new Blob(chunks , { type : 'video/webm' }))
//         down.href = record
//         down.download = 'myrecording.webm'
//     })
// }

// device_audio_captring : true,
				// mircophone_capturing : true,
				// display_capturing : true,
                class MediaCapture {
                    BlobChunks = []
                    videoStream = null
                    audioStream = null
                    combineStream = null
                    mediaRecorder = null
                    recordUrl = null
                    extnameVideo = '.webm'
                    MediaCaptureName = null
                    combineArray = []
                    // video and audio configuration
                    displayAudio = null
                    displayVideo = null
                    microphone = null
                    // handle pause , resume
                    playbackStatus = false // true pause .. false resume
                
                    constructor(config) {
                        this.displayAudio = config.device_audio_capturing
                        this.displayVideo = config.display_capturing
                        this.microphone   = config.microphone_capturing
                        console.log(this.displayAudio , this.displayAudio , this.microphone)
                        let x = config
                        
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
                    async GetAllWithMicrphoneStream() {
                        try {
                            this.videoStream = await navigator.mediaDevices.getDisplayMedia({ video : true , audio : true })
                
                            this.audioStream = await navigator.mediaDevices.getUserMedia({ audio : true })
                
                            this.combineArray.push([ ...this.videoStream.getTracks() , ...this.audioStream.getTracks() ])
                            this.StartRecord()
                        }catch(e) {
                            console.log("okay false")           
                        }
                    }
                    async RecordDisplayOnly() {
                        this.videoStream = await navigator.mediaDevices.getDisplayMedia({ video : true , audio : true })
                        this.combineArray.push([ ...this.videoStream.getTracks() ])
                
                        this.StartRecord()
                    }
                    async RecordMircophone() {
                        this.audioStream = await navigator.mediaDevices.getUserMedia({ audio : true })
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
                    ScreenShot() {
                
                    }
                }